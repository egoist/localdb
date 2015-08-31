
/*
 * localdb
 * (c) 2015
 * github.com/aprilorange/localdb
 */

() => {

  let definition = (W, LS) => {
    class LocalDB {
      constructor (name) {
        this.db = name
      }

      get () {
        return JSON.parse(LS.getItem(this.db))
      }

    }

    return LocalDB
  }

  ;(context, name, definition) => {
    if (typeof module !== 'undefined') {
      modul.exports = definition
    } else if (typeof context !== 'undefined') {
      context[name] = definition
    }

  }(window, 'localdb', definition(window, localStorage))

}()
