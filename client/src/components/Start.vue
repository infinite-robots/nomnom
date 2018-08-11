<template>
  <div class="start">
    <h1>NOMNOM!</h1>
    <p>
      NomNom helps your group pick a place to eat without all the back and forth conversation.
      Swipe left and right on food choices until the team comes to an agreement!
    </p>
    <div class="nick-form">
      <input class="input" v-model="nickname" type="text"
        placeholder="choose a nickname" minlength="2" maxlength="15"/>
      <button class="button" @click="login()">Continue</button>
    </div>
  </div>
</template>

<script>
import { setNick } from '../services/auth';

export default {
  name: 'start',
  data() {
    return {
      nickname: '',
    };
  },
  methods: {
    login() {
      setNick(this.nickname);
      this.$store.commit('setNick', this.nickname);
      this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/');
    },
  },
};
</script>

<style>

</style>
