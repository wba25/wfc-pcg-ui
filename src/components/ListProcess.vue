<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
      <v-row class="d-flex align-center justify-center pb-14">
        <v-col cols="auto">
          <h2>
            Gerador de imagem procedural com <a href="https://github.com/mxgmn/WaveFunctionCollapse" target="_blank">Wave Function Collapse</a>
          </h2>
          <p class="text-subtitle-1">Crie um novo gerador de imagens com seu tilemap de preferência ou explore os exemplos abaixo</p>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            :disabled="loadingProcess"
            variant="flat"
            color="primary"
            role="link"
            prepend-icon="mdi mdi-earth-box-plus"
            @click="goToNew"
          >
            Criar Novo Gerador
          </v-btn>
        </v-col>
      </v-row>
      <v-table v-if="!loading" density="comfortable" :fixed-header="true">
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
                @click="editTilemap(item)"
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
                class="text-primary"
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
  import { $on, $off } from "../common/event";
  import { mapActions, mapMutations } from "vuex";
  import { getBlobFromURL } from "../common/tile.js";
  import { handleHTTPRequestResposte, objIsEmpty, downloadFile } from "../common/util.js";
  export default {
    data () {
      return {
        processes: [],
        loading: false,
        loadingProcess: false,
        loadingProcesses: {},
      }
    },
    mounted() {
      this.getProcesses();
    },
    beforeDestroy() {
      $off("tiles-loaded");
    },
    methods: {
      ...mapActions(["indexProcess", "generate"]),
      ...mapMutations(["setRegisterStage", "setPath", "setTilesize", "setUnique", "resetTiles", "resetNeighbors"]),
      goToNew() {
        this.resetTileSet();
        this.$router.push('/novo');
      },
      resetTileSet() {
        this.setRegisterStage(0);
        this.setPath("novo_tilemap");
        this.setTilesize(8);
        this.setUnique(false);
        this.resetTiles();
        this.resetNeighbors();
      },
      formatPath(path) {
        return path.split("/")[1];
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
      async generateTilemap(path) {
        if (!objIsEmpty(this.loadingProcesses)) return;
        this.loadingProcesses[path] = true;
        try {
          const tileName = this.formatPath(path).toLocaleLowerCase();
          const raw = await this.generate(tileName);
          let result_url = handleHTTPRequestResposte(raw);
          if (result_url) {
            result_url = process.env.VUE_APP_SERVER_URL + "/" + result_url;
            let blob = await getBlobFromURL(result_url);
            downloadFile(blob, tileName + ".png");
          }
        } catch (error) {
          alert("A geração terminou em uma contradição. Tente novamente. Caso a situação persista, revise os detalhes do tilemap.");
        }
        delete this.loadingProcesses[path];
      },
      async editTilemap(rawData) {
        const data = JSON.parse(JSON.stringify(rawData));
        this.loadingProcess = true;
        this.loadingProcesses[data.path] = true;
        this.setRegisterStage(0);
        this.setPath(this.formatPath(data.path));
        this.setTilesize(data.tilesize);
        this.setUnique(data.unique);
        this.resetTiles(data.tiles);
        this.resetNeighbors(data.neighbors);
        $on("tiles-loaded", () => {
          this.$router.push('/novo');
        });
      },

    },
  }
</script>