<template>
  <div class="home">
    <h1>NOMNOM!</h1>
    <p>
      NomNom helps your group pick a place to eat without all the back and forth conversation.
      Swipe left and right on food choices until the team comes to an agreement!
    </p>
    <p><button class="button" @click="handleCreateRoom">Create a Room</button></p>
  </div>
</template>

<script>
import { makeRoom } from '../services/nomService';

export default {
  name: 'Home',
  methods: {
    handleCreateRoom() {
      makeRoom().then((resp) => {
        this.$router.push(`/nom/${resp.data.roomId}`);
      });
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
