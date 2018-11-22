import Vue from 'vue'
import axios from 'axios'
import VueSwal from 'vue-swal'

import App from './App'
import store from './store'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueSwal)

Vue.filter('trans', (value) => {
  return store.state.dict[value] || value
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  beforeCreate () {
    this.$store.dispatch('loadConfig')
  },
  mounted () {
    if (this.$electron) {
      this.$electron.ipcRenderer.on('navigate', (e, routePath) => {
        this.$router.push(routePath)
      })
    }
  }
}).$mount('#app')
