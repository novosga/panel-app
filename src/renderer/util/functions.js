
const debug = true

export function log () {
  if (debug) {
    console.log.apply(null, arguments)
  }
}
