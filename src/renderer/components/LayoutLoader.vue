<script>
  import auth from '@/store/modules/auth'
  import { log } from '@/util/functions'

  let eventSource = null
  let running = false
  let timeoutId = 0

  // this funciton is needed because computed value is not being updated
  function isExpired ($store) {
    return auth.getters.isExpired($store.state.auth)
  }

  function doConnect ($root, $store, attempts) {
    if (attempts <= 0) {
      return
    }
    $store.dispatch('fetchApiInfo').then(() => {
      disconnect()

      let mercureUrl = $store.state.apiInfo.mercureUrl || ''
      if (!mercureUrl.toLowerCase().startsWith('http')) {
        let serverUrl = $store.state.config.server
        if (!serverUrl.endsWith('/')) {
          serverUrl += '/'
        }
        if (mercureUrl.startsWith('/')) {
          mercureUrl = serverUrl + mercureUrl.substring(1)
        } else {
          mercureUrl = serverUrl + mercureUrl
        }
      }

      const url = new URL(mercureUrl)
      url.searchParams.append('topic', `/unidades/${$store.state.config.unity}/painel`)
      eventSource = new EventSource(url)
      eventSource.onmessage = (e) => {
        fetchMessages($root, $store)
      }
    }).catch((e) => {
      clearToken($root, $store).then(() => {
        doConnect($root, $store, attempts - 1)
      })
    })

    // initial fetch
    fetchMessages($root, $store)
  }

  function clearToken ($root, $store) {
    // clear token
    $store.commit('updateToken', {})
    return doCheckToken($root, $store)
  }

  function doCheckToken ($root, $store) {
    return new Promise((resolve, reject) => {
      let promise = Promise.resolve()
      if ($store.getters.isAuthenticated && isExpired($store)) {
        log('token expired, refreshing')
        promise = $store
          .dispatch('refresh')
          .then(() => {
            log('token refreshed successfully!')
            return Promise.resolve()
          })
          .catch((error) => {
            log('error on refresh token: ' + error)
            log('trying to issue a new token')
            return $store.dispatch('token')
          })
      } else if (!$store.getters.isAuthenticated) {
        log('not authenticated, issuing new token')
        promise = $store
          .dispatch('token')
          .then(() => {
            log('token issued successfully!')
            return Promise.resolve()
          })
          .catch((error) => {
            log('error on issuing token')
            return Promise.reject(error)
          })
      }
      promise.then(resolve).catch((error) => {
        log('error on issuing/refresh token. go to settings!')
        $root.$swal('Oops!', error, 'error')
        $root.$router.push('/settings')
      })
    })
  }

  function connect ($root, $store) {
    if (!$store.state.config || !$store.state.config.server) {
      log('panel no configured yet. go to settings!')
      $root.$router.push('/settings')
      return
    }

    doConnect($root, $store, 3)
  }

  function disconnect () {
    if (eventSource) {
      eventSource.close()
    }
  }

  function checkToken ($root, $store) {
    clearTimeout(timeoutId)

    if (!running) {
      log('not running')
      return
    }

    log('checking token. Authenticated: ' + $store.getters.isAuthenticated + '. isExpired: ' + isExpired($store))
    doCheckToken($root, $store)

    timeoutId = setTimeout(() => {
      checkToken($root, $store)
    }, 60 * 1000)
  }

  function fetchMessages ($root, $store) {
    if (!running) {
      running = true
      checkToken($root, $store)
    }
    $store
      .dispatch('fetchMessages')
      .catch(e => {
        log('Error getting messages: ' + e)
        clearToken($root, $store)
      })
  }

  export default {
    name: 'Layout',

    render (h) {
      let view
      try {
        const theme = this.$store.getters.theme
        view = require(`@/layouts/${theme}`).default
      } catch (e) {
        view = require('@/layouts/novosga.default').default
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
