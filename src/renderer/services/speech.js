
function speechQueue(speech, texts, lang, index) {
    return new Promise((resolve, reject) => {
        if (texts.length === 0 || index >= texts.length) {
            resolve()
            return
        }

        let text = texts[index]
        speech(text, lang).then(() => {
            queue(speech, texts, lang, index + 1)
        }, reject)
    })
}

export default {

    speech (text, lang) {
        return new Promise((resolve, reject) => {
            const msg = new SpeechSynthesisUtterance()
            msg.text = text
            msg.lang = lang

            msg.onerror = reject
            msg.onend   = resolve

            speechSynthesis.speak(msg)
      })
    },

    speechAll (texts, lang) {
        return speechQueue(this.speech, texts, lang, 0)
    }
}
