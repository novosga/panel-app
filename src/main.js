import Vue from 'vue'
import VueSwal from 'vue-swal'
import store from './store'

Vue.use(VueSwal)


const routes = {
    '': 'Home',
    home: 'Home',
    settings: 'Settings',
}

new Vue({
    el: '#app',
    store,
    data()  {
        return {
            routeName: window.location.hash.substring(1)
        }
    },
    computed: {
        ViewComponent () {
            const matchingView = routes[this.routeName] || '404'
            const page = matchingView
                        ? require('./pages/' + matchingView + '.vue')
                        : require('./pages/404.vue')
            return page
        }
    },
    methods: {
        goto(routeName) {
            this.routeName = routeName;
        }
    },
    render(h) {
        return h(this.ViewComponent)
    },
    beforeCreate() {
        this.$store.dispatch('loadConfig')
    }
})
