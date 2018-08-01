import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import modules from './modules'

Vue.use(Vuex)

modules.i18n = vuexI18n.store

const state = {
  config: {},
  messages: [
    /*
    {
      id,
      type,
      title
    }
    */
  ]
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

Vue.use(vuexI18n.plugin, store)
Vue.i18n.set('en')

export default store
