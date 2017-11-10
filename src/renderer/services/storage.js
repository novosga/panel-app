
export default {

    storagePrefixKey: 'painel-web.v2.',

    get (name, defaultValue) {
        const json = localStorage.getItem(this.storagePrefixKey + name)
        const data = JSON.parse(json) || defaultValue
        return data
    },

    set (name, value) {
        const str = JSON.stringify(value)
        localStorage.setItem(this.storagePrefixKey + name, str)
    }
}
