<script>
    const interval = 15 * 1000;

    let running = false

    function fetchMessages($root, store) {
        if (running) {
            store.dispatch('fetchMessages').then(messages => {
                setTimeout(() => fetchMessages($root, store), interval)
            }, (e) => {
                if (typeof(e) === 'string') {
                    alert(e)
                }

                running = false
                $root.goto('settings');
            })
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
            this.$store.dispatch('loadConfig').then(() => {
                running = true
                fetchMessages(this.$root, this.$store)
            })
        },

        beforeDestroy() {
            running = false
        }
    }
</script>
