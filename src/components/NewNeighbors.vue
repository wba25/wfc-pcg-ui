<template>
  <v-container class="fill-height" :fluid="true">
    <v-responsive class="d-flex align-center fill-height">
      <v-row>
        <v-col cols="auto" v-for="(neighbor, index) in neighbors">
          <NeighborForm
            :neighbor-id="neighbor.id"
            :neighbor-options="neighborsOpts"
            :previous-neighbor-id="index === 0 ? null : neighbors[index - 1].id"
            :onDelete="() => removeNeighborWithId(neighbor.id)"
            :unique="tilemap.unique"
          />
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            size="small"
            icon="mdi-plus"
            @click="neighbors.push({ id: generateNewNeighborId() })"
          ></v-btn>
        </v-col>
      </v-row>
      <v-row v-if="neighbors.length === 0">
        <v-col>
          <v-btn
            color="primary"
            size="small"
            variant="outlined"
            prepend-icon="mdi mdi-earth-box"
            :loading="loading"
            @click="autofill"
          >
            Preencher Adjacências Automaticamente
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-for="erro in errors">
          <v-alert
            type="error"
            variant="tonal"
            icon="$error"
            border="start"
            border-color="error"
            :title="erro.title"
            :text="erro.text"
            elevation="2"
          ></v-alert>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn
            variant="tonal"
            @click="setRegisterStage(0)"
            prepend-icon="mdi mdi-chevron-left"
          >
            Ajustar tiles
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            :loading="loading"
            @click="submit"
            append-icon="mdi mdi-chevron-right"
          >
            Salvar Tilemap
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import NeighborForm from "@/components/NeighborForm.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { neighborPairIsValid } from "./../common/tile";
import { handleHTTPRequestResposte, readFileAsBase64String } from "../common/util";
import { v4 as uuidv4 } from "uuid";
export default {
  components: {
    NeighborForm,
  },
  data() {
    return {
      errors: [],
      neighbors: [],
      loading: false,
      neighborsOpts: [],
    };
  },
  watch: {},
  mounted() {
    this.initNeighborsOpts();
    this.initNeighborsData(this.getNeighbors);
  },
  computed: {
    ...mapGetters(["tilemap", "getNeighbors", "getNeighbor", "getPathName"]),
  },
  methods: {
    ...mapActions(["storeProcess", "generateNeighbors"]),
    ...mapMutations(["setRegisterStage", "removeNeighbor", "resetNeighbors"]),
    removeNeighborWithId(neighborId) {
      this.neighbors = this.neighbors.filter((n) => n.id !== neighborId);
      this.removeNeighbor(neighborId);
    },
    generateNewNeighborId() {
      return uuidv4();
    },
    initNeighborsData(rawNeighbors) {
      Object.keys(rawNeighbors).forEach((neighborId) => {
        const neighbor = this.getNeighbor(neighborId);
        if (
          neighborPairIsValid(neighbor, this.tilemap.tiles)
        ) {
          this.neighbors.push({
            id: neighborId,
          });
        } else {
          this.removeNeighbor(neighborId);
        }
      });
    },
    initNeighborsOpts() {
      this.neighborsOpts = this.tilemap.tiles;
    },
    async autofill() {
      this.loading = true;
      this.errors = [];
      try {
        const raw = await this.generateNeighbors(this.getPathName);
        let neighborsData = handleHTTPRequestResposte(raw);
        this.resetNeighbors(neighborsData);
        this.initNeighborsData(this.getNeighbors);
      } catch (error) {
        console.log(error);
        this.errors.push({
          title: "Erro ao criar vizinhos automaticamente",
          text: error,
        });
      }
      this.loading = false;
    },
    async submit() {
      this.loading = true;
      this.errors = [];
      if (this.neighbors.length === 0) {
        this.errors.push({
          title: "Erro",
          text: "É necessário adicionar pelo menos um vizinho",
        });
      }
      if (this.errors.length === 0) {
        try {
          const payload = this.tilemap;
          for (let i = 0; i < payload.tiles.length; i++) {
            const tile = payload.tiles[i];
            for (let j = 0; j < tile.assets.length; j++) {
              tile.assets[j] = await readFileAsBase64String(tile.assets[j]);
            }
          }
          const res = await this.storeProcess(payload);
          if (!res) {
            throw "Error no servidor";
          }
          this.$router.push('/');
        } catch (error) {
          this.errors.push({
            title: "Erro ao criar mapa",
            text: error,
          });
        }
      }
      this.loading = false;
    },
  },
};
</script>
