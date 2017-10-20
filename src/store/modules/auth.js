import { Client } from '../../services/api'
import storage from '../../services/storage'
import moment from "moment"

const accessTokenKey  = 'access_token'
const refreshTokenKey = 'refresh_token'
const expireDateKey   = 'expire_date'

const state = {
    accessToken: storage.get(accessTokenKey),
    refreshToken: storage.get(refreshTokenKey),
    expireDate: storage.get(expireDateKey)
}

const getters = {
    isAuthenticated (state) {
        return !!state.accessToken
    },
    isExpired (state) {
        const dt1 = moment(state.expireDate)
        const dt2 = moment()
        return !state.expireDate || (dt1 <= dt2)
    }
}

const mutations = {
    updateToken (state, token) {
        state.accessToken = token.access_token
        state.refreshToken = token.refresh_token

        const dt = moment().add(token.expires_in, 's')

        state.expireDate = dt.format()

        storage.set(accessTokenKey, state.accessToken)
        storage.set(refreshTokenKey, state.refreshToken)
        storage.set(expireDateKey, state.expireDate)
    }
}

const actions = {
    token ({ state, commit, rootState }) {
        return new Promise((resolve, reject) => {
            try {
                const server = rootState.config.server
                const clientId = rootState.config.clientId
                const clientSecret = rootState.config.clientSecret
                const username = rootState.config.username
                const password = rootState.config.password

                if (!server) {
                    throw 'No server host'
                }

                if (!clientId || !clientSecret) {
                    throw 'No client credential'
                }
                if (!username || !password) {
                    throw 'No username and password'
                }

                const data = {
                        grant_type: 'password',
                        client_id: clientId,
                        client_secret: clientSecret,
                        username: username,
                        password: password
                    }

                const api = new Client(rootState.config.server)

                api
                    .request('/token', 'POST', data)
                    .then((token) => {
                        commit('updateToken', token)
                        resolve(token)
                    }, reject)
            } catch (e) {
                reject(e)
            }
        })
    },

    refresh ({ state, commit, rootState }) {
        return new Promise((resolve, reject) => {
            try {
                const clientId = rootState.config.clientId
                const clientSecret = rootState.config.clientSecret
                const username = rootState.config.username
                const password = rootState.config.password

                const data = {
                        grant_type: 'refresh_token',
                        client_id: rootState.config.clientId,
                        client_secret: rootState.config.clientSecret,
                        refresh_token: state.refreshToken
                    }

                const api = new Client(rootState.config.server)

                api
                    .request('/token', 'POST', data)
                    .then(token => {
                        commit('updateToken', token)
                        resolve(token)
                    }, reject)
            } catch (e) {
                reject(e)
            }
        })
    }
}

export default {
	state,
	getters,
	actions,
	mutations
}
