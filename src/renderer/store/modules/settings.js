import { Client } from '../../services/api'

/*
const config = this.$store.state.config
// defaults
config.services = config.services || []
config.alert = config.alert || audio.alertsAvailable[0]
*/

const state = {
    unities: [],
    services: [],
}

const getters = {

}

const mutations = {
    updateUnities (state, unities) {
        state.unities = unities
    },

    updateServices (state, services) {
        state.services = services
    }
}

const actions = {
	fetchUnities ({ state, commit, rootState }) {
        return new Promise((resolve, reject) => {
            const api = new Client(rootState.config.server)

            api
                .unities(rootState.auth.accessToken)
                .then(data => {
                    commit('updateUnities', data)
                    resolve()
                }, error => {
                    reject(error)
                })
        })
    },

    fetchServices ({ state, commit, rootState }, unityId) {
        commit('updateServices', [])

        if (!unityId) {
            return Promise.resolve()
        }

        return new Promise((resolve, reject) => {
            const api = new Client(rootState.config.server)

            api
                .services(rootState.auth.accessToken, unityId)
                .then(data => {
                    commit('updateServices', data)
                    resolve()
                }, error => {
                    reject(error)
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
