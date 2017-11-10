import Vue from 'vue'
import VueSwal from 'vue-swal'

import App from './App'
import store from './store'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(VueSwal)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  beforeCreate() {
      this.$store.dispatch('loadConfig')
  }
}).$mount('#app')
