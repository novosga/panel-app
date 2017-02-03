import Vue from 'vue'
import Vuex from 'vuex'
import Config from '../services/config.js'
import { Client } from '../services/api.js'

Vue.use(Vuex)

const HISTORY_MAX_LENGTH = 10
const api = new Client()

function zeroFill(number, length) {
    return new Array(length - number.toString().length + 1).join('0') + number;
}

function normalizeMessage(data) {
    return {
        id: data.id,
        type: 'ticket',
        title: data.siglaSenha + zeroFill(data.numeroSenha, 3),
        subtitle: data.local + ' ' + zeroFill(data.numeroLocal, 2),
        description: data.prioridade,
        $data: data
    }
}

function equals(m1, m2) {
    return m1.type === m2.type && m1.title === m2.title
}

const store = new Vuex.Store({
    state: {
        config: {},
        message: {},
        history: [],
        unities: [],
        services: [],
    },
    mutations: {
        config (state, config) {
            state.config = config
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
        unities (state, unities) {
            state.unities = unities
        },
        services (state, services) {
            state.services = services
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
            return new Promise((resolve, reject) => {
                api
                    .connect(state.config)
                    .then(() => {
                        api
                            .messages(state.config.unity, state.config.services)
                            .then(messages => {
                                const last = normalizeMessage(messages[0])

                                if (!state.message.id || state.message.id < last.id) {
                                    commit('message', last)
                                    commit('append', last)
                                }

                                resolve()
                            }, reject)
                    }, reject)
            })
        },
        fetchUnities ({ commit, state }) {
            return new Promise((resolve, reject) => {
                api
                    .connect(state.config)
                    .then(() => {
                        api
                            .unities()
                            .then(unities => {
                                commit('unities', unities)
                                resolve()
                            }, reject)
                    })
            })
        },
        fetchServices ({ commit, state }, unityId) {
            return new Promise((resolve, reject) => {
                commit('services', [])

                if (!unityId) {
                    return Promise.resolve()
                }

                api
                    .connect(state.config)
                    .then(() => {
                        api
                            .services(unityId)
                            .then(services => {
                                commit('services', services)
                                resolve()
                            }, reject)
                    })
            })
        }
    }
})

export default store
