import axios from 'axios'
import axiosRetry from 'axios-retry'

class Client {
  constructor (server, moduleName, retries) {
    let host = server + ''

    if (!host.endsWith('/')) {
      host += '/'
    }

    if (moduleName) {
      host += moduleName + '/'
    }

    if (retries) {
      this.retries = retries
    }

    this.endpoint = host + 'api'
  }

  request (url, config) {
    config.withCredentials = true

    // Set auto-retry for network failed requests
    axiosRetry(axios, {
      retries: this.retries || 5,
      retryDelay: axiosRetry.exponentialDelay
    })

    return new Promise((resolve, reject) => {
      axios
        .request(`${this.endpoint}/${url}`, config)
        .then(response => {
          resolve(response.data)
        }, error => {
          let message = error.message
          if (error.response) {
            message = error.response.statusText
            if (error.response.data && error.response.data.error_description) {
              message += ': ' + error.response.data.error_description
            }
          }
          reject(message)
        })
    })
  }

  info (token) {
    const config = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
    return this.request('', config)
  }

  unities (token) {
    const config = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
    return this.request(`unidades`, config)
  }

  services (token, unityId) {
    const config = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
    return this.request(`unidades/${unityId}/servicos`, config)
  }

  messages (token, unity, services) {
    const id = typeof (unity) === 'object' ? unity.id : unity
    const config = {
      headers: {
        Authorization: 'Bearer ' + token
      },
      params: {
        servicos: services.join(',')
      }
    }
    return this.request(`unidades/${id}/painel`, config)
  }
}

export { Client }
