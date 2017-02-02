
export default {
        
    storageKey: 'painel-web.v2.config',
    
    load () {
        let json = localStorage.getItem(this.storageKey),
            config = JSON.parse(json) || {}
        return config
    },
    
    save (config) {
        localStorage.setItem(this.storageKey, JSON.stringify(config))
    }
}