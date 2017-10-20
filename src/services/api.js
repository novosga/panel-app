import jQuery from 'jquery'

class Client {

    constructor(server) {
        let host = server + ''

        if (!host.endsWith('/')) {
            host += '/'
        }

        this.endpoint = host + 'api'
    }

    request(uri, method, data, headers) {
        return new Promise((resolve, reject) => {
            headers = headers || {}

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
                    reject(error)
                }
            })
        })
    }

    unities(token) {
        let headers =  {
            Authorization: 'Bearer ' + token
        }
        return this.request('/unidades', 'GET', null, headers)
    }

    services(token, unityId) {
        let headers =  {
            Authorization: 'Bearer ' + token
        }
        return this.request(`/unidades/${unityId}/servicos`, 'GET', null, headers)
    }

    messages(token, unity, services) {
        let headers =  {
            Authorization: 'Bearer ' + token
        }
        const id = typeof(unity) === 'object' ? unity.id : unity,
            params = {
                servicos: services.join(',')
            }
        return this.request(`/unidades/${id}/painel`, 'GET', params, headers)
    }
}

export { Client }
