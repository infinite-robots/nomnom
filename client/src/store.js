import Vue from 'vue';
import Vuex from 'vuex';
// import * as _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setNick(state, nickname) {
      state.user = nickname;
    },
  },
});
