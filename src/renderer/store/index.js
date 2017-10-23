import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'
import socketIO from 'socket.io-client'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import settings from './modules/settings'
import auth from './modules/auth'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
    config: {},
    history: [
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
    modules: {
        i18n: vuexI18n.store,
        settings,
        auth
    },
    strict: debug,
    plugins: debug ? [] : []
})

Vue.use(vuexI18n.plugin, store)
Vue.i18n.set('en')

export default store
