import { createStore } from "vuex";
import { getObjValues } from "../common/util.js";
import { loadAssets } from "../common/tile.js";
import { getQuantityOfTileSymmetry } from "../common/validation.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { $emit } from "../common/event";

const store = createStore({
  state() {
    return {
      registerStage: 0,
      path: "data/novo_tilemap/",
      tilesize: 8,
      unique: false,
      tiles: {}, // {id: "", name: "", symmetry: "", weight: 0, assets: []} // base64 image
      neighbors: {} // { left: "", right: ""}
    };
  },
  mutations: {
    setRegisterStage(state, stage) {
      state.registerStage = stage;
    },
    setPath(state, path) {
      state.path = "data/" + path.replace(/[^a-zA-Z0-9]/g, "_").replace(/\s/g, "_") + "/";
    },
    setTilesize(state, tilesize) {
      state.tilesize = tilesize;
    },
    setUnique(state, unique) {
      state.unique = !!unique;
    },
    // Tiles
    async resetTiles(state, tiles = []) {
      let payload = {};
      for (let i = 0; i < tiles.length; i++) {
        let assets = await loadAssets(tiles[i], state.unique);
        payload[uuidv4()] = {
          name: tiles[i]["name"] || "",
          symmetry: tiles[i]["symmetry"] || "X",
          weight: tiles[i]["weight"] || 1,
          assets: assets || []
        };
      }
      state.tiles = payload;
      $emit("tiles-loaded");
    },
    addTile(state, payload) {
      state.tiles[payload["id"]] = payload["tile"];
    },
    removeTile(state, id) {
      delete state.tiles[id];
    },
    // Neighbors
    resetNeighbors(state, neighbors = []) {
      let payload = {};
      for (let i = 0; i < neighbors.length; i++) {
        payload[uuidv4()] = {
          left: neighbors[i]["left"] || "",
          right: neighbors[i]["right"] || "",
        };
      }
      state.neighbors = payload;
    },
    addNeighbor(state, payload) {
      state.neighbors[payload["id"]] = payload["neighbor"];
    },
    removeNeighbor(state, id) {
      delete state.neighbors[id];
    }
  },
  getters: {
    getRegisterStage(state) {
      return state.registerStage;
    },
    tilemap (state) {
      return {
        path: state.path,
        tilesize: state.tilesize,
        unique: state.unique,
        tiles: Object.getOwnPropertyNames(state.tiles).length !== 0 ? getObjValues(state.tiles) : [],
        neighbors: Object.getOwnPropertyNames(state.neighbors).length !== 0 ? getObjValues(state.neighbors) : []
      }
    },
    getPathName(state) {
      return state.path.split("/")[1];
    },
    getTilesize(state) {
      return state.tilesize;
    },
    getUnique(state) {
      return state.unique;
    },
    // Tiles
    getTiles(state) {
      return state.tiles;
    },
    getTile: (state) => (id) => {
      return state.tiles[id] || null;
    },
    getTileAsset: (state, getters) => (name, index=0) => {
      let tile = getters.tilemap.tiles.filter(t => t.name === name)[0] || null;
      if (tile) {
        return tile.assets[index] || null;
      }
      return null;
    },
    getNeighborIsValid: (state, getters) => (tileName, index) => {
      let tile = getters.tilemap.tiles.filter(t => t.name === tileName)[0] || null;
      if (tile) {
        return getQuantityOfTileSymmetry(tile.symmetry, true) > index;
      }
      return false;
    },
    // Neighbors
    getNeighbors(state) {
      return state.neighbors;
    },
    getNeighbor: (state) => (id) => {
      return state.neighbors[id] || null;
    },
  },
  actions: {
    indexProcess: async function({ state, commit }) {
      return axios.get(process.env.VUE_APP_SERVER_URL + "/api/processes");
    },
    storeProcess: async function({ state, commit }, payload) {
      return axios.post(process.env.VUE_APP_SERVER_URL + "/api/processes", payload);
    },
    generate: async function({ state, commit }, name) {
      return axios.get(process.env.VUE_APP_SERVER_URL + "/api/processes/" + name + "/generate");
    },
  }
});

export default store;
