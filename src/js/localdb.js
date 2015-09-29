/*
 * localdb
 * (c) 2015
 * github.com/aprilorange/localdb
 */

() => {

  const defaultOpts = { limit: 0, sortBy: 'index', sort: 1, skip: 0 }

  let definition = (W, LS) => {
    class LocalDB {
      constructor (name, type = 'Array', timestamp = false) {
        if (typeof name === 'string') {
          this.db = name
          this.type = type
          this.timestamp = timestamp
        } else if (typeof name === 'object') {
          const opts = name
          this.db = opts.name
          this.type = opts.type || 'Array'
          this.timestamp = opts.timestamp || false
        }

      }

      get (where) {
        // where maps to key or index, depending on the type if Object or Array
        const collection = JSON.parse(LS.getItem(this.db))
        if (!where)
          return collection
        else if (typeof collection === 'undefined' || !collection)
          return null
        else
          return collection[where]
      }

      findOne (query) {
        return this.find(query, {
          limit: 1
        })
      }

      find (query, opts = defaultOpts) {
        if (this.type !== 'Array') {
          return console.error('The .findOne method only works if the database is an Array!')
        }

        opts.limit = opts.limit || defaultOpts.limit
        opts.sortBy = opts.sortBy || defaultOpts.sortBy
        opts.sort = opts.sort || defaultOpts.sort
        opts.skip = opts.skip || defaultOpts.skip

        let collection = this.get() || []
        if (query) {
          collection = collection.filter((obj) => {
            let has = []
            for (var key in query) {
              has.push(obj[key] === query[key])
            }
            if (arrayEachTrue(has)) {
              return true
            } else {
              return false
            }
          })
        }
        if (opts.limit === 1 && opts.skip === 0) {
          return collection[0]
        } else {

          collection = collection.sort((a, b) => {
            if (a[opts.sortBy] < b[opts.sortBy]) {
              return -opts.sort
            } else if (a[opts.sortBy] > b[opts.sortBy]) {
              return opts.sort
            } else {
              return 0
            }
          })

          if (opts.limit === 0) {
            return collection.slice(opts.skip)
          } else {
            return collection.slice(opts.skip, opts.limit + opts.skip)
          }
        }
      }

      add (obj) {
        if (this.type !== 'Array') {
          console.error('The .add method only works if the database is an Array!')
        }
        let collection = this.get() || []
        let index = 0
        if (collection && collection.length > 0) {
          index = collection.length
        }
        obj = this.initObj(index, obj)
        collection.push(obj)
        this.override(collection)
        return this
      }

      initObj (index, obj) {
        obj.index = index
        obj._id = objectId()
        if (this.timestamp) {
          obj.createdAt = new Date()
          obj.updatedAt = new Date()
        }
        return obj
      }

      set (key, value) {
        // works if db is object
        if (this.type !== 'Object') {
          console.error('The .set method only works if the database is an Object!')
        } else {
          let collection = this.get() || {}
          collection[key] = value
          this.override(collection)
        }
        return this
      }

      save (obj) {
        if (this.type !== 'Array') {
          console.error('The .save method only works if the database is an Array!')
        }
        let collection = this.get()
        if (collection[obj.index]._id === obj._id) {
          collection[obj.index] = obj
          this.override(collection)
        }
        return this
      }

      override (collection, reinit = false) {
        if (this.type === 'Array' && reinit) {
          for (var i = 0; i < collection.length; i++) {
            collection[i] = this.initObj(i, collection[i])
          }
        }
        LS.setItem(this.db, JSON.stringify(collection))
        return this
      }

      remove (key, value) {
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
          delete collection[key]
        }

        LS.setItem(this.db, JSON.stringify(collection))
        return this
      }

      destroy () {
        LS.removeItem(this.db)
        return this
      }

    }

    return LocalDB
  }

  function arrayEachTrue (array) {
    for (var i = 0; i < array.length; i++) {
      if (!array[i]) {
        return false
      }
    }
    return true
  }

  function objectId () {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase()
  }

  ;(context, name, definition) => {
    if (typeof module !== 'undefined') {
      module.exports = definition
    } else if (typeof context !== 'undefined') {
      context[name] = definition
    }
  }(window, 'localdb', definition(window, window.localStorage))

}()
