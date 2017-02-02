
export default {
        
    alertPath: 'sound',
    
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
        filename = filename || this.alertsAvailable.Default
        
        const audio = new Audio()
        audio.src = `${this.alertPath}/alert/${filename}`
        audio.play()
    }
}
