import jQuery from 'jquery'
import { OAuth2 } from './oauth2.js'

class Client {

    constructor() {
        this.credential = null
        this.accessToken = null
    }

    request(uri, method, data, headers) {
        return new Promise((resolve, reject) => {
            headers = headers || {}

            if (this.accessToken) {
                headers['Authorization'] =  'Bearer ' + this.accessToken.access_token
            }

            jQuery.ajax({
                url: this.endpoint + uri,
                type: method,
                dataType: 'json',
                data: data || {},
                headers: headers,
                cache: false,
                success: response => {
                    resolve(response)
                },
                error: response => {
                    let error = response.responseJSON || {}

                    if (error.error === 'invalid_grant' && this.credential) {
                        this
                           .authenticate(
                               this.credential.user,
                               this.credential.pass
                           )
                           .then(() => {
                               this.request(uri, method, data, headers)
                           })
                        this.credential = null
                        this.accessToken = null
                    } else {
                       reject(error)
                    }
                }
            })
        })
    }
    
    connect(props) {
        return new Promise((resolve, reject) => {
            props = props || {}

            if (this.isAuthenticated()) {
                setTimeout(() => {
                    resolve(this)
                }, 10)
            } else {
                try {
                    if (!props.server) {
                        throw 'No server host'
                    }
                    if (!props.clientId || !props.clientSecret) {
                        throw 'No client credential'
                    }
                    if (!props.username || !props.password) {
                        throw 'No username and password'
                    }

                    let host = props.server + ''
                    if (!host.endsWith('/')) {
                        host += '/'
                    }

                    this.endpoint = host + 'api'
                    this.oauth2 = new OAuth2(this, props.clientId, props.clientSecret)

                    this
                        .authenticate(props.username, props.password)
                        .then(() => {
                            resolve(this)
                        })
                } catch (e) {
                    reject(e)
                }

            }
        })
    }
    
    isAuthenticated() {
        return !!this.accessToken
    }

    authenticate(username, password) {
        return new Promise((resolve, reject) => {
            this
                .oauth2
                .token(username, password)
                .then(token => {
                    this.accessToken = token
                    this.credential = {
                        user: username,
                        pass: password
                    }
                    resolve()
                }, () => {
                    reject()
                })
        })
    }

    unities() {
        return this.request('/unidades', 'GET')
    }

    services(unityId) {
        return this.request(`/unidades/${unityId}/servicos`, 'GET')
    }

    messages(unity, services) {
        const id = typeof(unity) === 'object' ? unity.id : unity,
            params = {
                servicos: services.join(',')
            }
        return this.request(`/unidades/${id}/painel`, 'GET', params)
    }
}

export { Client }