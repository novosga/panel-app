<script>
    import socketIO from 'socket.io-client'

    let socket = null

    function connect($root, $store) {
        if (!$store.state.config || !$store.state.config.server) {
            $root.$router.push('/settings')
            return
        }

        const tokens = $store.state.config.server.split(':')
        const host = `${tokens[0]}:${tokens[1]}:2020`

        console.log('[websocket] trying connect to websocket server: ' + host)

        socket = socketIO(host, {
            reconnectionAttempts: 3
        })

        socket.on('connect', () => {
            console.log('[websocket] connected')
            socket.emit('register panel', {
                unidade: $store.state.config.unity,
                servicos: $store.state.config.services
            })
        })

        socket.on('register ok', evt => {
            console.log('[websocket] painel registered')
            fetchMessages($root, $store)
        })

        socket.on('call ticket', evt => {
            console.log('[websocket] call ticket')
            fetchMessages($root, $store)
        })

        socket.on('reconnect_failed', evt => {
            console.log('[websocket] max attempts reached, ajax polling fallback')
            fetchMessages($root, $store)
            socket.open()
        })
    }

    function disconnect() {
        if (socket) {
            socket.close()
        }
    }

    function fetchMessages($root, $store) {
        try {
            if (!$store.getters.isAuthenticated) {
                throw "Please configure client id and client secret."
            }

            let promise
            if ($store.getters.isExpired) {
                console.log('token expired')

                promise = new Promise((resolve, reject) => {
                    $store
                        .dispatch('refresh')
                        .then(() => {
                            $store
                                .dispatch('fetchMessages')
                                .then(resolve, reject)
                        }, e => {
                            console.log(e)
                            reject
                        })
                })
            } else {
                promise = $store.dispatch('fetchMessages')
            }

            promise.then(messages => {
            }, (e) => {
                if (typeof(e) === 'string') {
                    throw e
                }
                throw "Unknown error. Please see the log console"
            })
            .catch(e => {
                $root.$swal("Oops!", e, "error")
                $root.$router.push('/settings')
            })
        } catch (e) {
            $root.$swal("Oops!", e, "error")
            $root.$router.push('/settings')
        }
    }

    export default {
        name: 'Layout',

        render(h) {
            let view
            try {
                const theme = $store.getters.theme
                view = require(`@/layouts/${theme}`).default
            } catch (e) {
                view = require('@/layouts/Default').default
            }
            return h(view)
        },

        beforeMount () {
            connect(this, this.$store)
        },

        beforeDestroy() {
            disconnect()
        }
    }
</script>
