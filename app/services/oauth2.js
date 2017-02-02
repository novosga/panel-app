
class OAuth2 {

    constructor(api, clientId, clientSecret) {
        this.api = api
        this.clientId = clientId
        this.clientSecret = clientSecret
    }

    token(username, password) {
        return new Promise((resolve, reject) => {
            let data = { 
                    grant_type: 'password',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    username: username,
                    password: password
                }

            this.api
                .request('/token', 'POST', data)
                .then(token => {
                    resolve(token)
                }, () => {
                    reject()
                })
        })
    }

    refresh(token) {
        return new Promise((resolve, reject) => {
            let data = { 
                    grant_type: 'refresh_token',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: token.refresh_token
                }

            this.api
                .request('/token', 'POST', data)
                .then(token => {
                    resolve(token)
                }, () => {
                    reject()
                })
        })
    }
}

export { OAuth2 }