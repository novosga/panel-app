<script>
    const interval = 15 * 1000;

    let running = false

    function fetchMessages($root, $store) {
        try {
            if (running) {
                if (!$store.getters.isAuthenticated) {
                    throw "Please configure client id and client secret."
                }

                let promise

                if ($store.getters.isExpired) {
                    promise = new Promise((resolve, reject) => {
                        $store.dispatch('refresh').then(() => {
                            $store.dispatch('fetchMessages').then(resolve, reject)
                        }, reject)
                    })
                } else {
                    promise = $store.dispatch('fetchMessages')
                }

                promise.then(messages => {
                    setTimeout(() => fetchMessages($root, $store), interval)
                }, (e) => {
                    if (typeof(e) === 'string') {
                        throw e
                    }
                    throw "Unknown error. Please see the log console"
                })
                .catch(e => {
                    $root.$swal("Oops!", e, "error")
                    running = false
                    $root.goto('settings');
                })
            }
        } catch (e) {
            $root.$swal("Oops!", e, "error")
            running = false
            $root.goto('settings');
        }
    }

    export default {
        name: 'Layout',

        render(h) {
            let view
            try {
                // TODO: dynamic layout
                view = require('../layouts/Default.vue')
            } catch (e) {
                view = require('../layouts/Default.vue')
            }
            return h(view)
        },

        beforeMount () {
            running = true
            fetchMessages(this.$root, this.$store)
        },

        beforeDestroy() {
            running = false
        }
    }
</script>
