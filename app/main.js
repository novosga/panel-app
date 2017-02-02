import Vue from 'vue'
import Vuex from 'vuex'
import Queue from 'promise-queue'
import store from './store'


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
            return matchingView
                        ? require('./pages/' + matchingView + '.vue')
                        : require('./pages/404.vue')
        }
        },
    render(h) {
        return h(this.ViewComponent)
    }
})
