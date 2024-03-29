<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col>
          <v-text-field
            v-model="tilemapName"
            variant="outlined"
            density="comfortable"
            label="Nome do tilemap"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="tileSize"
            :prefix="tileSize + ' X '"
            suffix="px"
            type="number"
            min="0"
            step="1"
            variant="outlined"
            density="comfortable"
            label="Tamanho dos tiles"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="false" class="d-flex">
        <v-col cols="3">
          <v-text-field
            v-model="mapSizeW"
            :disabled="true"
            suffix="tiles"
            type="number"
            variant="outlined"
            density="comfortable"
            label="Largura"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="mapSizeH"
            :disabled="true"
            suffix="tiles"
            type="number"
            variant="outlined"
            density="comfortable"
            label="Altura"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="text-left">
          <p class="pb-6">
            <span class="text-caption">Imagem resultado terá:</span> <br/>
            <span class="text-overline">{{ mapSizeW * tileSize }} x {{ mapSizeH * tileSize}} px</span>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-switch
            v-model="unique"
            :label="
              unique ?
              'Único (Cada variação do tile é única e deve ser definida manualmente)' :
              'Único (As variações do tile serão geradas automaticamente)'
            "
            color="primary"
            density="compact"
            inset
            hide-details
            false-icon="mdi-close-circle"
            true-icon="mdi-check-circle"
            hint="Marque essa opção caso queira definir as variações dos tiles manualmente. Caso contrário, o sistema irá gerar as variações automaticamente."
            :disabled="tiles.length > 0"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto" v-for="tile in tiles" :key="tile.id">
          <TileForm :tile-id="tile.id" :unique="unique" :onDelete="() => removeTileWithId(tile.id)"/>
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            size="small"
            icon="mdi-plus"
            @click="tiles.push({ id: generateNewTileId() })"
          ></v-btn>
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
            to="/"
            :disabled="loading"
            prepend-icon="mdi mdi-chevron-left"
          >
            Home
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            :loading="loading"
            @click="next"
            append-icon="mdi mdi-chevron-right"
          >
            Definir Adjacências
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import TileForm from "@/components/TileForm.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import {
  validateTilesNames,
  validateTilesWeights,
  validateTilesSymmetries,
  validateTilesAssets,
} from "../common/validation";
export default {
  components: {
    TileForm,
  },
  data() {
    return {
      tilemapName: "",
      tileSize: 0,
      mapSizeW: 0,
      mapSizeH: 0,
      unique: false,
      tiles: [],
      errors: [],
      loading: false
    };
  },
  watch: {
    tilemapName(newName, oldName) {
      if (newName !== oldName) {
        this.setPath(newName);
      }
    },
    tileSize(newSize, oldSize) {
      if (newSize !== oldSize) {
        this.setTilesize(this.tileSize);
      }
    },
    mapSizeW(newW, oldW) {
      if (newW !== oldW) {
        this.setImageWidth(newW);
      }
    },
    mapSizeH(newH, oldH) {
      if (newH !== oldH) {
        this.setImageHeight(newH);
      }
    },
    unique(newUnique, oldUnique) {
      if (newUnique !== oldUnique) {
        this.setUnique(newUnique);
      }
    },
  },
  mounted() {
    this.tilemapName = this.getPathName;
    this.tileSize = this.getTilesize;
    this.unique = this.getUnique;
    this.mapSizeW = this.getImageWidth;
    this.mapSizeH = this.getImageHeight;
    this.initTiles(this.getTiles);
  },
  computed: {
    ...mapGetters(["tilemap", "getPathName", "getTilesize", "getTiles", "getUnique", "getImageWidth", "getImageHeight"]),
  },
  methods: {
    ...mapActions(["storeProcess"]),
    ...mapMutations(["setPath", "setTilesize", "setRegisterStage", "removeTile", "setUnique", "setImageWidth", "setImageHeight"]),
    removeTileWithId(tileId) {
      this.tiles = this.tiles.filter((tile) => tile.id !== tileId);
      this.removeTile(tileId);
    },
    initTiles(rawTiles) {
      Object.keys(rawTiles).forEach((tileId) => {
        this.tiles.push({
          id: tileId,
        });
      });
    },
    generateNewTileId() {
      return uuidv4();
    },
    validateTiles() {
      this.errors = [];
      if (this.tilemap.tiles.length < 1) {
        this.errors.push({
          title: "Número de tiles insuficiente",
          text: "É necessário pelo menos um tile para gerar um tilemap",
        });
      }
      let error =
        validateTilesNames(this.tilemap.tiles) ||
        validateTilesWeights(this.tilemap.tiles) ||
        validateTilesSymmetries(this.tilemap.tiles, this.unique) ||
        validateTilesAssets(this.tilemap.tiles);
      if (error) {
        this.errors.push({
          title: "Tile inválido",
          text: error,
        });
      }
      return this.errors.length === 0;
    },
    next() {
      if (this.validateTiles()) {
        this.loading = true;
        this.setRegisterStage(1);
      }
    },
  },
};
</script>
