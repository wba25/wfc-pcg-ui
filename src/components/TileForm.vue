<template>
  <v-expand-x-transition>
    <v-card
      width="325px"
      height="325px"
      elevation="6"
      class="overflow-y-auto pa-4 ml-4"
      :image="bgImage"
      color="#bdbdbd"
    >
      <div class="float-btn">
        <v-btn color="error" density="compact" icon="mdi-close-circle" variant="plain" @click="onDelete"></v-btn>
      </div>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="name"
                label="Nome"
                bg-color="rgba(255, 255, 255, 0.8)"
                variant="plain"
                hide-details
                required
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="symmetry"
                label="Simetria"
                :items="symmetryItems"
                item-title="text"
                item-value="value"
                class="tile-form-input mb-2"
                bg-color="rgba(255, 255, 255, 0.8)"
                variant="plain"
                hide-details
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-slider
            v-model="weight"
            label="Peso"
            thumb-label
            max="2"
            min="0"
            class="tile-form-input mb-2"
            bg-color="rgba(255, 255, 255, 0.8)"
            color="grey"
            variant="plain"
            hide-details
            required
          >
            <template v-slot:append>
              <v-text-field
                v-model="weight"
                type="number"
                style="width: 60px"
                density="compact"
                hide-details
                max="1"
                min="0"
                class="tile-form-input"
                bg-color="rgba(255, 255, 255, 0.8)"
                variant="plain"
              ></v-text-field>
            </template>
          </v-slider>
          <v-row v-if="unique" class="bg-white" no-gutters>
            <v-col>
              <h4 class="headline">Assets:</h4>
              <v-progress-linear
                :model-value="(assets.length/cardinality) * 100"
                height="10"
                :color="assets.length == cardinality ? 'grey' : 'warning'"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <v-row class="bg-white" align="center" justify="space-between" no-gutters v-for="(asset, index) in assets">
            <v-col cols="10">
              <v-file-input
                v-model="assets[index]"
                placeholder="Selecione uma imagem"
                prepend-icon=""
                density="compact"
                accept="image/png"
                @change="previewFile(assets[index])"
                class="tile-form-input"
                :clearable="false"
                variant="plain"
                hide-details
                required
              >
                <template v-slot:prepend-inner>
                  <v-icon
                    class="cursor-pointer"
                    :color="fileIsValid(assets[index]) ? 'grey' : 'warning'"
                    :icon="'mdi ' + (fileIsValid(assets[index]) ? 'mdi-image-check' : 'mdi-image-remove')"
                  ></v-icon>
                </template>
              </v-file-input>
            </v-col>
            <v-col class="text-right" cols="2">
              <v-btn class="" density="compact" icon="mdi-close" elevation="0" @click="assets.splice(asset, 1)"></v-btn>
            </v-col>
          </v-row>
          <v-fade-transition>
            <v-btn v-if="hasAddAssetButton" color="primary" icon="mdi-image-plus-outline" class="ml-1 mt-1" elevation="20" density="compact" @click="assets.push(1)"></v-btn>
          </v-fade-transition>
        </v-form>
      </v-card-text>
    </v-card>
  </v-expand-x-transition>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  export default {
    props: {
      tileId: {
        type: String,
        required: true,
      },
      onDelete: {
        type: Function,
        required: true,
      },
      unique: {
        type: Boolean,
        required: true,
      },
    },
    data () { 
      return {
        name: "tile",
        symmetry: "X",
        weight: 1,
        assets: [],
        bgImage: '',
        symmetryItems: [
          { text: 'X', value: 'X' },
          { text: 'T', value: 'T' },
          { text: 'I', value: 'I' },
          { text: 'L', value: 'L' },
          { text: '\\', value: '\\' },
          // { text: 'F', value: 'F' }, // sem suporte
        ],
        placeholderImg: 'https://t3.ftcdn.net/jpg/03/45/05/92/360_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg'
      }
    },
    watch: {
      name(newName, oldName) {
        if (newName !== oldName) {
          this.commitTileData();
        }
      },
      symmetry(newSymmetry, oldSymmetry) {
        if (newSymmetry !== oldSymmetry) {
          this.commitTileData();
        }
      },
      weight(newWeight, oldWeight) {
        if (newWeight !== oldWeight) {
          this.commitTileData();
        }
      },
    },
    mounted: function () {
      const storedTile = this.getTile(this.tileId);
      if (storedTile) {
        this.name = storedTile.name;
        this.symmetry = storedTile.symmetry;
        this.weight = storedTile.weight;
        this.assets = storedTile.assets;
        if (this.assets.length > 0) {
          this.previewFile(this.assets[0])
        }
      } else {
        this.commitTileData();
      }
    },
    computed: {
      ...mapGetters(["getTile"]),
      hasAddAssetButton() {
        if (!this.unique) {
          return this.assets.length < 1;
        } else {
          switch (this.symmetry) {
            case "L":
              return this.assets.length < 4;
            case "T":
              return this.assets.length < 4;
            case "I":
              return this.assets.length < 2;
            case "\\":
              return this.assets.length < 2;
            case "F":
              return this.assets.length < 8;
            default:
              return this.assets.length < 1;
          }
        }
      },
      cardinality() {
        if (this.unique) {
          switch (this.symmetry) {
            case "X":
              return 1;
            case "T":
              return 4;
            case "I":
              return 2;
            case "L":
              return 4;
            case "F":
              return 8;
            case "\\":
              return 2;
            default:
              return 0;
          }
        }
        return 1;
      },
    },
    methods: {
      ...mapMutations(["addTile"]),
      commitTileData() {
        this.addTile(
          {
            id: this.tileId,
            tile: {
              name: this.name.replaceAll(" ", "_"),
              symmetry: this.symmetry,
              weight: this.weight,
              assets: this.assets,
            }
          }
        );
      },
      previewFile(files) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {this.bgImage = reader.result;},
          false
        );

        if (files && files[0]) {
          reader.readAsDataURL(files[0]);
        }
      },
      fileIsValid(files) {
        if (files && files[0]) {
          return true;
        }
        return false;
      }
    },
  }
</script>
<style scoped>
.float-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}
.cursor-pointer {
  cursor: pointer;
}
</style>