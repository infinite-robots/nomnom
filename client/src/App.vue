<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  sockets: {
    connect() {
      console.log('socket connected');
    },
    nom(val) {
      console.log('nom', val);
    },
  },
};
</script>

<style>

</style>
