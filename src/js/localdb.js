/*
 * localdb
 * (c) 2015
 * github.com/aprilorange/localdb
 */

() => {

  let definition = (W, LS) => {
    class LocalDB {
      constructor(name, type = 'Array') {
        this.db = name
        this.type = type
      }

      get() {
        return JSON.parse(LS.getItem(this.db))
      }

      add(obj) {
        let collection = this.get() || []
        let index = 0
        if (collection.length > 0) {
          index = collection.length
        }
        obj.index = index
        collection.push(obj)
        this.override(collection)
        return this
      }

      set(key, value) {
        // works if db is object
        if (this.type !== 'Object') {
          console.error(
            'The .set method only works if the database is an Object!')
        } else {
          let collection = this.get() || {}
          collection[key] = value
          this.override(collection)
        }
        return this
      }

      override(collection) {
        LS.setItem(this.db, JSON.stringify(collection))
      }

      remove(key, value) {
        let collection = this.get()

        if (this.type === 'Array') {
          if (collection.length === 0) {
            return this
          }
          collection = collection.filter((obj) => {
            if (obj[key] === value) {
              return false
            } else {
              return true
            }
          })
        } else if (this.type === 'Object') {
          delete(collection[key])
        }

        LS.setItem(this.db, JSON.stringify(collection))
        return this
      }

      destroy() {
        LS.removeItem(this.db)
        return this
      }

    }

    return LocalDB
  }

  ;
  (context, name, definition) => {
    if (typeof module !== 'undefined') {
      modul.exports = definition
    } else if (typeof context !== 'undefined') {
      context[name] = definition
    }

  }(window, 'localdb', definition(window, localStorage))

}()
