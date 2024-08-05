<script>
  import auth from '@/store/modules/auth'
  import { log } from '@/util/functions'

  let eventSource = null
  let running = false
  let timeoutId = 0

  function isExpired ($store) {
    return auth.getters.isExpired($store.state.auth)
  }

  function doConnect ($root, $store) {
    $store.dispatch('fetchApiInfo').then(() => {
      disconnect()

      const url = new URL($store.state.apiInfo.mercureUrl)
      url.searchParams.append('topic', `/unidades/${$store.state.config.unity}/painel`)
      eventSource = new EventSource(url)
      eventSource.onmessage = (e) => {
        fetchMessages($root, $store)
      }
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
    if (eventSource) {
      eventSource.close()
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
