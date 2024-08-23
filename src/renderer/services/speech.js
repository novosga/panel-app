
function speechQueue (speech, texts, lang, index) {
  return new Promise((resolve, reject) => {
    if (texts.length === 0 || index >= texts.length) {
      resolve()
      return
    }

    let text = texts[index]
    speech(text, lang).then(() => {
      speechQueue(speech, texts, lang, index + 1)
        .then(resolve)
        .catch(reject)
    }, reject)
  })
}

export default {

  speech (text, lang) {
    return new Promise((resolve, reject) => {
      const msg = new SpeechSynthesisUtterance()
      msg.text = text
      msg.lang = (lang || '').replace('_', '-').toLowerCase()

      msg.onerror = reject
      msg.onend = resolve

      speechSynthesis.speak(msg)
    })
  },

  speechAll (texts, lang) {
    return speechQueue(this.speech, texts, lang, 0)
  }
}
