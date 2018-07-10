
export default {

    storagePrefixKey: 'painel-web.v2.',

    get (name, defaultValue) {
        const json = localStorage.getItem(this.storagePrefixKey + name)
        let data
        try {
            data = JSON.parse(json)
        } catch (e) {
            data = defaultValue
        }
        return data
    },

    set (name, value) {
        const str = JSON.stringify(value)
        localStorage.setItem(this.storagePrefixKey + name, str)
    }
}
