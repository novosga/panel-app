<script>
    const interval = 15 * 1000;
    
    let running = false
    
    function fetchMessages(store) {
        if (running) {
            store.dispatch('fetchMessages').then(messages => {
                console.log('fetchMessages', messages)

                setTimeout(() => fetchMessages(store), interval)
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
                fetchMessages(this.$store)
            })
        },
        
        beforeDestroy() {
            running = false
        }
    }
</script>