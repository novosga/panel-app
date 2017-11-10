import axios from 'axios'

class Client {

    constructor(server) {
        let host = server + ''

        if (!host.endsWith('/')) {
            host += '/'
        }

        this.endpoint = host + 'api'
    }

    request(url, config) {
        config.withCredentials = true

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

    unities(token) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        return this.request(`unidades`, config)
    }

    services(token, unityId) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        return this.request(`unidades/${unityId}/servicos`, config)
    }

    messages(token, unity, services) {
        const id = typeof(unity) === 'object' ? unity.id : unity
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
