<template>
  <ListProcess />
  <v-btn
    color="primary"
    variant="tonal"
    icon="mdi-help"
    to="/tutorial"
    class="float-btn"
  ></v-btn>
</template>

<script setup>
  import ListProcess from '@/components/ListProcess.vue'
</script>

<style scoped>
.float-btn {
  position: fixed;
  bottom: 15px;
  right: 15px;
  z-index: 1;
}
</style>
