import { Client } from '../../services/api'
import storage from '../../services/storage'
import moment from 'moment'

const accessTokenKey = 'access_token'
const refreshTokenKey = 'refresh_token'
const expireDateKey = 'expire_date'

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
    if (!token) {
      token = {
        access_token: null,
        refresh_token: null
      }
    }

    state.accessToken = token.access_token
    state.refreshToken = token.refresh_token
    state.expireDate = null

    if (token.expires_in) {
      // expiration time minus 5 minutes
      const secs = 5 * 60
      const dt = moment().add(token.expires_in - secs, 's')
      state.expireDate = dt.format()
    }

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
          throw new Error('No server host')
        }

        if (!clientId || !clientSecret) {
          throw new Error('No client credential')
        }
        if (!username || !password) {
          throw new Error('No username and password')
        }

        var params = new URLSearchParams()
        params.append('grant_type', 'password')
        params.append('client_id', clientId)
        params.append('client_secret', clientSecret)
        params.append('username', username)
        params.append('password', password)

        const api = new Client(rootState.config.server)

        api
          .request('token', { method: 'POST', data: params })
          .then(data => {
            commit('updateToken', data)
            resolve(data)
          }, error => {
            reject(error)
          })
      } catch (e) {
        reject(e)
      }
    })
  },

  refresh ({ state, commit, rootState }) {
    return new Promise((resolve, reject) => {
      var params = new URLSearchParams()
      params.append('grant_type', 'refresh_token')
      params.append('client_id', rootState.config.clientId)
      params.append('client_secret', rootState.config.clientSecret)
      params.append('refresh_token', state.refreshToken)

      const api = new Client(rootState.config.server)

      api
        .request('token', { method: 'POST', data: params })
        .then(data => {
          commit('updateToken', data)
          resolve(data)
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
