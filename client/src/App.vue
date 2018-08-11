<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  background: #f8f8f8;
  margin: 0;
  padding: 0;
  font-family: 'Assistant', sans-serif;
}
#app {
  max-width: 500px;
  margin: 2rem auto 2rem;
  background: #FFF;
  text-align: center;
  padding: 2rem;
  height: calc(100vh - 8rem);
}
h1 {
  margin: 0 0 2rem;
}
.button {
  border: 1px solid #000;
  display: inline-block;
  border-radius: 1rem;
  padding: .5em 1em;
  text-decoration: none;
}
</style>
