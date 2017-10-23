import Vue from 'vue'
import storage from '../services/storage'

const HISTORY_MAX_LENGTH = 10

function equals(m1, m2) {
    return m1.type === m2.type && m1.title === m2.title
}

export default {
    updateConfig (state, config) {
        config = config || {}
        state.config = config
        storage.set('config', config)

        const locale = config.locale || 'en'
        const dict = require(`../i18n/${locale}.js`).default

        Vue.i18n.add(locale, dict)
        Vue.i18n.set(locale)
    },
    newMessage (state, message) {
        if (state.history.length) {
            const last = state.history[0]
            if (last.id === message.id) {
                return
            }

            // prevent multiple messages of same type+title
            for (let i = 0; i < state.history.length; i++) {
                let m = state.history[i]
                if (equals(m, message)) {
                    state.history.splice(state.history.indexOf(m), 1)
                    break
                }
            }
        }

        state.history.push(message)

        if (state.history.length > HISTORY_MAX_LENGTH) {
            state.history.shift()
        }
    }
}
