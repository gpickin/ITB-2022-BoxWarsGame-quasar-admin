import Vue from "vue";
import Vuex from "vuex";

import appstate from "./appstate";
import questions from "./questions";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const store = new Vuex.Store({
  modules: {
    appstate,
    questions,
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING,
});

export default store;
