import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n';
import Config from '../services/config.js'
import novosga from '../bridges/novosga/store.js'

Vue.use(Vuex)

const HISTORY_MAX_LENGTH = 10

function equals(m1, m2) {
    return m1.type === m2.type && m1.title === m2.title
}

const store = new Vuex.Store({
    state: {
        config: {},
        message: {},
        history: []
    },
    mutations: {
        config (state, config) {
            state.config = config

            const locale = config.locale || 'en'
            const dict = require(`../i18n/${locale}.js`)
            Vue.i18n.add(locale, dict.default);
            Vue.i18n.set(locale);
        },
        message (state, message) {
            state.message = message
        },
        append (state, message) {
            // prevent multiple messages of same type+title
            for (let i = 0; i < state.history.length; i++) {
                let m = state.history[i]
                if (equals(m, message)) {
                    state.history.splice(state.history.indexOf(m), 1)
                    break
                }
            }

            state.history.push(state.message)

            if (state.history.length > HISTORY_MAX_LENGTH) {
                state.history.shift()
            }
        },
        dict (state, dict) {
            state.dict = dict
        }
    },
    actions: {
        loadConfig ({ commit }) {
            const config = Config.load()
            commit('config', config)
        },
        saveConfig ({ commit }, config) {
            commit('config', config)
            Config.save(config)
        },
        fetchMessages ({ commit, state }) {
            // novosga fetchMessage bridge
            return novosga.actions.fetchNovosgaMessages({ commit, state })
        }
    },
    modules: {
        i18n: vuexI18n.store,
        // novosga module
        novosga
    }
})

Vue.use(vuexI18n.plugin, store);

export default store
