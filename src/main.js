import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueClipboards from 'vue-clipboards'
Vue.use(VueClipboards)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
