import Vue from "vue";
import App from "./App";
import * as filters from "./utils/filters.js"; // global filter
import uView from "uview-ui";
import store from "./store";

// #ifdef H5
// Manually mount the h5 wake-up app plugin on the h5 page
import airBtn from "@/components/m-airbtn/index.vue";
let btn = Vue.component("airBtn", airBtn); //Global registration
document.body.appendChild(new btn().$mount().$el);
// #endif



Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

const msg = (title, duration = 1500, mask = false, icon = "none") => {
  //Unified prompt to facilitate global modification
  if (Boolean(title) === false) {
    return;
  }
  uni.showToast({
    title,
    duration,
    mask,
    icon,
  });
};
// Introduce vuex
Vue.prototype.$store = store;
Vue.use(uView);
Vue.config.productionTip = false;
// theme color
Vue.prototype.$mainColor = "#ff3c2a";
// Highlight theme color
Vue.prototype.$lightColor = "#ff6b35";
// can be directly called this.$api
Vue.prototype.$api = {msg };

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
