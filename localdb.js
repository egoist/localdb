/*
 * localdb
 * (c) 2015
 * github.com/egoist/localdb
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

  var defaultOpts = { limit: 0, sortBy: 'index', sort: 1, skip: 0 };

  var definition = function definition(W, LS) {
    var LocalDB = (function () {
      function LocalDB(name) {
        var type = arguments.length <= 1 || arguments[1] === undefined ? 'Array' : arguments[1];
        var timestamp = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        _classCallCheck(this, LocalDB);

        if (typeof name === 'string') {
          this.db = name;
          this.type = type;
          this.timestamp = timestamp;
        } else if (typeof name === 'object') {
          var opts = name;
          this.db = opts.name;
          this.type = opts.type || 'Array';
          this.timestamp = opts.timestamp || false;
        }
        this.populate_keys = null;
      }

      _createClass(LocalDB, [{
        key: 'get',
        value: function get(where) {
          // where maps to key or index, depending on the type if Object or Array
          var collection = JSON.parse(LS.getItem(this.db));
          if (!where && typeof where !== 'number') return collection;else if (typeof collection === 'undefined' || !collection) return null;else return collection[where];
        }
      }, {
        key: 'findOne',
        value: function findOne(query) {
          return this.find(query, {
            limit: 1
          });
        }
      }, {
        key: 'find',
        value: function find(query) {
          var _this = this;

          var opts = arguments.length <= 1 || arguments[1] === undefined ? defaultOpts : arguments[1];

          if (this.type !== 'Array') {
            return console.error('The .findOne method only works if the database is an Array!');
          }

          opts.limit = opts.limit || defaultOpts.limit;
          opts.sortBy = opts.sortBy || defaultOpts.sortBy;
          opts.sort = opts.sort || defaultOpts.sort;
          opts.skip = opts.skip || defaultOpts.skip;

          var collection = this.get() || [];
          if (query) {
            collection = collection.filter(function (obj) {
              var has = [];
              for (var key in query) {
                has.push(obj[key] === query[key]);
              }
              if (arrayEachTrue(has)) {
                return true;
              } else {
                return false;
              }
            });
          }
          if (opts.limit === 1 && opts.skip === 0) {
            collection = collection[0];
          } else {

            collection = collection.sort(function (a, b) {
              if (a[opts.sortBy] < b[opts.sortBy]) {
                return -opts.sort;
              } else if (a[opts.sortBy] > b[opts.sortBy]) {
                return opts.sort;
              } else {
                return 0;
              }
            });

            if (opts.limit === 0) {
              collection = collection.slice(opts.skip);
            } else {
              collection = collection.slice(opts.skip, opts.limit + opts.skip);
            }
          }

          var populate = function populate(collection) {

            if (_this.populate_keys && _this.populate_keys.length > 0) _this.populate_keys.forEach(function (key) {
              var ref = collection[key];
              if (ref) {
                var db = new LocalDB(ref.__className, 'Array');
                var temp = db.findOne({ '_id': ref.objectId });
                collection[key] = temp;
              }
            });
            return collection;
          };

          if (Array.isArray(collection)) {
            collection.forEach(function (c) {
              c = populate(c);
            });
          } else if (typeof collection === 'object') {
            collection = populate(collection);
          }

          this.populate_keys = null;

          return collection;
        }
      }, {
        key: 'add',
        value: function add(obj) {
          if (this.type !== 'Array') {
            console.error('The .add method only works if the database is an Array!');
          }
          var collection = this.get() || [];
          var index = 0;
          if (collection && collection.length > 0) {
            index = collection.length;
          }
          obj = this.initObj(index, obj);
          collection.push(obj);
          this.override(collection);
          return this;
        }
      }, {
        key: 'initObj',
        value: function initObj(index, obj) {
          obj.index = index;
          if (!obj._id) {
            obj._id = objectId();
          }
          if (this.timestamp) {
            if (!obj.createdAt) {
              obj.createdAt = new Date();
            }
            obj.updatedAt = new Date();
          }
          return obj;
        }
      }, {
        key: 'set',
        value: function set(key, value) {
          // works if db is object
          if (this.type !== 'Object') {
            console.error('The .set method only works if the database is an Object!');
          } else {
            var collection = this.get() || {};
            collection[key] = value;
            this.override(collection);
          }
          return this;
        }
      }, {
        key: 'inc',
        value: function inc(key) {
          var value = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

          return this.incOrDec('inc', key, value);
        }
      }, {
        key: 'dec',
        value: function dec(key) {
          var value = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

          return this.incOrDec('dec', key, value);
        }
      }, {
        key: 'incOrDec',
        value: function incOrDec(type, key) {
          var value = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

          if (this.type !== 'Object') {
            console.error('The .set method only works if the database is an Object!');
          } else {
            var collection = this.get() || {};
            if (type === 'inc') {
              collection[key] = (collection[key] || 0) + value;
            } else if (type === 'dec') {
              collection[key] = (collection[key] || 0) - value;
            }
            this.override(collection);
          }
          return this;
        }
      }, {
        key: 'save',
        value: function save(obj) {
          if (this.type !== 'Array') {
            console.error('The .save method only works if the database is an Array!');
          }
          var collection = this.get();
          if (collection[obj.index]._id === obj._id) {
            collection[obj.index] = obj;
            this.override(collection);
          }
          return this;
        }
      }, {
        key: 'extend',
        value: function extend(id) {
          if (!id) {
            return console.error('You should provide an objectId to reference');
          }
          return {
            __type: 'Pointer',
            __className: this.db,
            objectId: id
          };
        }
      }, {
        key: 'populate',
        value: function populate() {
          for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
            keys[_key] = arguments[_key];
          }

          this.populate_keys = keys;
          return this;
        }
      }, {
        key: 'override',
        value: function override(collection) {
          var reinit = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

          if (this.type === 'Array' && reinit) {
            for (var i = 0; i < collection.length; i++) {
              collection[i] = this.initObj(i, collection[i]);
            }
          }
          LS.setItem(this.db, JSON.stringify(collection));
          return this;
        }
      }, {
        key: 'remove',
        value: function remove(key, value) {
          var collection = this.get();

          if (this.type === 'Array') {
            if (collection.length === 0) {
              return this;
            }
            collection = collection.filter(function (obj) {
              if (obj[key] === value) {
                return false;
              } else {
                return true;
              }
            });
            for (var i = 0; i < collection.length; i++) {
              collection[i].index = i;
            }
          } else if (this.type === 'Object') {
            delete collection[key];
          }

          LS.setItem(this.db, JSON.stringify(collection));
          return this;
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          LS.removeItem(this.db);
          return this;
        }
      }]);

      return LocalDB;
    })();

    return LocalDB;
  };

  function arrayEachTrue(array) {
    for (var i = 0; i < array.length; i++) {
      if (!array[i]) {
        return false;
      }
    }
    return true;
  }

  function objectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }

  ;(function (context, name, definition) {
    if (typeof module !== 'undefined') {
      module.exports = definition;
    } else if (typeof context !== 'undefined') {
      context[name] = definition;
    }
  })(window, 'localdb', definition(window, window.localStorage));
})();