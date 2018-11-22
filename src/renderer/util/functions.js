
const debug = false

export function log () {
  if (debug) {
    console.log.apply(null, arguments)
  }
}
