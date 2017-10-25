<script>
    import socketIO from 'socket.io-client'

    let socket = null

    function connect($root, $store) {
        const tokens = $store.state.config.server.split(':')
        const host = `${tokens[0]}:${tokens[1]}:2020`

        console.log('[websocket] trying connect to websocket server: ' + host)

        socket = socketIO(host, {
            reconnectionAttempts: 5
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
            console.log('[websocket] max attempts reached')

            $root
            .$swal({
                type: 'Oops!',
                icon: 'error',
                text: 'Max connection attempts reached. Please check is the websocket server is running.',
                buttons: {
                    cancel: true,
                    confirm: false,
                    retry: {
                        text: "Try again",
                        value: "retry",
                    },
                },
            })
            .then(value => {
                if (value === 'retry') {
                    console.log('[websocket] trying to connect')
                    socket.open()
                }
            })
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
                running = false
                $root.$router.push('/settings')
            })
        } catch (e) {
            $root.$swal("Oops!", e, "error")
            running = false
            $root.$router.push('/settings')
        }
    }

    export default {
        name: 'Layout',

        render(h) {
            let view
            try {
                // TODO: dynamic layout
                view = require('@/layouts/Default').default
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
