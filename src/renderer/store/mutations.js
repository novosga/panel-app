import Vue from 'vue'
import storage from '../services/storage'

const HISTORY_MAX_LENGTH = 5

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
        if (state.messages.length) {
            const last = state.messages[0]
            if (last.id === message.id) {
                return
            }

            // prevent multiple messages of same type+title
            for (let i = 0; i < state.messages.length; i++) {
                let m = state.messages[i]
                if (equals(m, message)) {
                    state.messages.splice(state.messages.indexOf(m), 1)
                    break
                }
            }
        }

        state.messages.unshift(message)

        if (state.messages.length > HISTORY_MAX_LENGTH) {
            state.messages.pop()
        }
    }
}
