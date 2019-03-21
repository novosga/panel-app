<script>
  import socketIO from 'socket.io-client/dist/socket.io'
  import auth from '@/store/modules/auth'
  import { log } from '@/util/functions'

  let socket = null
  let running = false
  let timeoutId = 0

  function isExpired ($store) {
    return auth.getters.isExpired($store.state.auth)
  }

  function doConnect ($root, $store) {
    const tokens = $store.state.config.server.split('//')
    const schema = tokens[0]
    const host = tokens[1].split('/')[0].split(':')[0]
    const port = 2020
    const url = `${schema}//${host}:${port}`

    log('[websocket] trying connect to websocket server: ' + url)

    socket = socketIO(url, {
      path: '/socket.io',
      transports: ['websocket'],
      secure: true,
      timeout: 2000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3
    })

    socket.on('connect', () => {
      log('[websocket] connected')
      socket.emit('register panel', {
        unity: $store.state.config.unity,
        services: $store.state.config.services
      })
    })

    socket.on('disconnect', () => {
      log('[websocket] disconnected!')
    })
  
    socket.on('connect_error', (evt) => {
      log('[websocket] connect error', evt)
    })

    socket.on('connect_timeout', () => {
      log('[websocket] timeout')
    })
  
    socket.on('reconnect_failed', () => {
      log('[websocket] max attempts reached, ajax polling fallback')
      fetchMessages($root, $store)
      socket.open()
    })
  
    socket.on('error', (evt) => {
      log('[websocket] error', evt)
    })

    socket.on('register ok', () => {
      log('[websocket] painel registered')
      fetchMessages($root, $store)
    })

    socket.on('call ticket', () => {
      log('[websocket] call ticket')
      fetchMessages($root, $store)
    })

    // initial fetch
    fetchMessages($root, $store)
  }

  function connect ($root, $store) {
    if (!$store.state.config || !$store.state.config.server) {
      log('panel no configured yet. go to settings!')
      $root.$router.push('/settings')
      return
    }

    if ($store.getters.isAuthenticated && $store.getters.isExpired) {
      log('token expired, trying to refresh')

      $store.dispatch('token').then(() => {
        log('token refreshed successfully!')
        doConnect($root, $store)
      }, () => {
        log('error on refresh token. go to settings!')
        $root.$router.push('/settings')
      })
    } else {
      doConnect($root, $store)
    }
  }

  function disconnect () {
    if (socket) {
      socket.close()
    }
  }

  function checkToken ($store) {
    clearTimeout(timeoutId)

    if (!running) {
      log('not running')
      return
    }

    log('checking token. Authenticated: ' + $store.getters.isAuthenticated)

    if ($store.getters.isAuthenticated && isExpired($store)) {
      log('token expired, refreshing')
      $store
        .dispatch('refresh')
        .then(() => {
          log('token refreshed')
        }, e => {
          log(e)
        })
    }

    timeoutId = setTimeout(() => {
      checkToken($store)
    }, 60 * 1000)
  }

  function fetchMessages ($root, $store) {
    if (!running) {
      running = true
      checkToken($store)
    }

    try {
      if (!$store.getters.isAuthenticated) {
        throw new Error('Please configure client id and client secret.')
      }

      let promise
      if (isExpired($store)) {
        log('token expired')

        promise = new Promise((resolve, reject) => {
          $store
            .dispatch('refresh')
            .then(() => {
              log('token refreshed')
              $store
                .dispatch('fetchMessages')
                .then(resolve, reject)
            }, e => {
              log(e)
              reject(e)
            })
        })
      } else {
        promise = $store.dispatch('fetchMessages')
      }

      promise
        .then(messages => {}, (e) => {
          if (typeof (e) === 'string') {
            throw new Error(e)
          }
          throw new Error('Unknown error. Please see the log console')
        })
        .catch(e => {
          // clear token
          $store.commit('updateToken', {})

          $root.$swal('Oops!', e.message, 'error')
          $root.$router.push('/settings')
        })
    } catch (e) {
      $root.$swal('Oops!', e.message, 'error')
      $root.$router.push('/settings')
    }
  }

  export default {
    name: 'Layout',

    render (h) {
      let view
      try {
        const theme = this.$store.getters.theme
        view = require(`@/layouts/${theme}`).default
      } catch (e) {
        view = require('@/layouts/Default').default
      }
      return h(view)
    },

    beforeMount () {
      connect(this, this.$store)
    },

    beforeDestroy () {
      running = false
      disconnect()
      clearTimeout(timeoutId)
    }
  }
</script>
