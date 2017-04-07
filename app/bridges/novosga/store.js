import { Client } from './api.js'

const api = new Client()

function normalizeMessage(data) {
    return {
        id: data.id,
        type: 'ticket',
        title: data.siglaSenha + data.numeroSenha,
        subtitle: data.local + ' ' + data.numeroLocal,
        description: data.prioridade,
        $data: data
    }
}

const state = {
    unities: [],
    services: [],
}

const getters = {

}

const mutations = {
    unities (state, unities) {
        state.unities = unities
    },
    services (state, services) {
        state.services = services
    }
}

const actions = {
	fetchNovosgaMessages ({ commit, state }) {
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
                })
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

export default {
	state,
	getters,
	actions,
	mutations
}