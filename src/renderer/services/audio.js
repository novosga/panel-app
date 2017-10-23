
export default {

    alertPath: 'static/sound',

    alertsAvailable: {
        'Default': 'ekiga-vm.wav',
        'Airport Bingbong': 'airport-bingbong.wav',
        'Ding dong': 'ding-dong.wav',
        'Doorbell Bingbong': 'doorbell-bingbong.wav',
        'Info bleep': 'infobleep.wav',
        'Quito Mariscal sucre': 'quito-mariscal-sucre.wav',
        'Toy doorbell': 'toydoorbell.wav'
    },

    playAlert (filename) {
        return new Promise((resolve, reject) => {
            filename = filename || this.alertsAvailable.Default

            const audio = new Audio()
            audio.src = `${this.alertPath}/alert/${filename}`
            audio.onended = resolve
            audio.onerror = reject
            audio.play()
        })
    }
}
