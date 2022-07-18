import Vue from "vue";
import axios from "axios";

Vue.prototype.$axios = axios;

const axiosInstance = axios.create({
  baseURL: process.env.API,
});

const axiosLoginInstance = axios.create({
  baseURL: process.env.API,
});

export default ({ store, Vue }) => {
  Vue.prototype.$axios = axios;

  axiosInstance.interceptors.request.use(
    function (config) {
      config.headers["Authorization"] =
        "Bearer " + store.getters["appstate/getJWT"];
      return config;
    },
    function (error) {}
  );
};
// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance };
export { axiosLoginInstance };
