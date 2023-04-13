<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
      <v-row class="d-flex align-center justify-center pb-14">
        <v-col cols="auto">
          <h1>
            Gerador de tilemaps com <a href="https://github.com/mxgmn/WaveFunctionCollapse" target="_blank">Wave Function Collapse</a>
          </h1>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn :disabled="loadingProcess" size="large" color="blue" role="link" @click="$router.push('/novo')">Novo</v-btn>
        </v-col>
      </v-row>
      <v-table v-if="!loading" density="comfortable" fixed-header="true">
        <thead>
          <tr>
            <th>Set</th>
            <th>Qty Tiles</th>
            <th>Qty Vizinhos</th>
            <th>Tamanho do Tile</th>
            <th>Editar</th>
            <th>Gerar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in processes">
            <td>{{ formatPath(item.path) }}</td>
            <td>{{ item.tiles.length }}</td>
            <td>{{ item.neighbors.length }}</td>
            <td>{{ item.tilesize }}x{{ item.tilesize }} px</td>
            <td>
              <v-btn
                :disabled="loadingProcess"
                icon="mdi-image-edit"
                density="compact"
                flat
              ></v-btn>
            </td>
            <td>
              <v-btn
                :loading="loadingProcesses[item.path]"
                @click="generateTilemap(item.path)"
                icon="mdi-image-refresh"
                density="compact"
                flat
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-progress-circular
        v-else
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-responsive>
  </v-container>
</template>

<script>
  import { mapActions } from "vuex";
  import { handleHTTPRequestResposte, objIsEmpty } from "../common/util.js";
  export default {
    data () {
      return {
        processes: [],
        loading: false,
        loadingProcess: true,
        loadingProcesses: {},
      }
    },
    mounted() {
      this.getProcesses();
    },
    methods: {
      ...mapActions(["indexProcess"]),
      formatPath(path) {
        return path.split("/")[1].toUpperCase();
      },
      async getProcesses() {
        this.loading = true;
        try {
          const raw = await this.indexProcess();
          this.processes = handleHTTPRequestResposte(raw);
        } catch (error) {
          alert(error);
        }
        this.loading = false;
      },
      delay(ms) {
        return new Promise(res => setTimeout(res, ms));
      },
      async generateTilemap(path) {
        if (!objIsEmpty(this.loadingProcesses)) return;
        this.loadingProcesses[path] = true;
        await this.delay(4000);
        delete this.loadingProcesses[path];
      },
    },
  }
</script>
