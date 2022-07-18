import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";
import routes from "./routes";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  Router.beforeEach((to, from, next) => {
    // Look at all routes
    Router.options.routes.forEach((route) => {
      // If this is the current route and it's secure
      // console.log('path is: ' + to.matched[0].path)
      // console.log('route.path is: ' + route.path)
      // store.commit("appstate/setPageTitle",to.meta.title)
      if (to.matched[0].path === route.path && route.secure) {
        // Verify that the user isn't logged in
        if (!store.getters["appstate/isLoggedIn"]) {
          // Route back to the landing
          let nextRoute = "/login?goto=" + to.path;
          return next(nextRoute);
        }
      }
    });
    // Proceed as normal
    next();
  });

  return Router;
}
