import { Client } from '@/services/api'

const state = {
  unities: [],
  services: [],
  availableThemes: [
    {
      id: 'novosga.default',
      name: 'Default',
      options: [
        {
          name: 'logo',
          label: 'Logo',
          type: 'url',
          required: false,
          placeholder: 'https://'
        },
        {
          name: 'footerText',
          label: 'Footer text',
          type: 'text',
          required: false,
          placeholder: ''
        }
      ]
    }
  ]
}

const getters = {
  getTheme: (state) => (id) => {
    const theme = state.availableThemes.find(t => t.id === id)
    return theme
  }
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
