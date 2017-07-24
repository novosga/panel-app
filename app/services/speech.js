
export default {

    speech (filename) {
        return new Promise((resolve, reject) => {
            const msg = new SpeechSynthesisUtterance()
            msg.text = text
            msg.lang = lang

            msg.onerror = reject
            msg.onend = resolve

            speechSynthesis.speak(msg)
      })
    }
}
