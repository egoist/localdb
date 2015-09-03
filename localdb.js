/*
 * localdb
 * (c) 2015
 * github.com/aprilorange/localdb
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

  var definition = function definition(W, LS) {
    var LocalDB = (function () {
      function LocalDB(name) {
        var type = arguments.length <= 1 || arguments[1] === undefined ? 'Array' : arguments[1];

        _classCallCheck(this, LocalDB);

        this.db = name;
        this.type = type;
      }

      _createClass(LocalDB, [{
        key: 'get',
        value: function get() {
          return JSON.parse(LS.getItem(this.db));
        }
      }, {
        key: 'add',
        value: function add(obj) {
          var collection = this.get() || [];
          var index = 0;
          if (collection.length > 0) {
            index = collection.length;
          }
          obj.index = index;
          collection.push(obj);
          this.override(collection);
          return this;
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
        key: 'override',
        value: function override(collection) {
          LS.setItem(this.db, JSON.stringify(collection));
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
  (function (context, name, definition) {
    if (typeof module !== 'undefined') {
      modul.exports = definition;
    } else if (typeof context !== 'undefined') {
      context[name] = definition;
    }
  })(window, 'localdb', definition(window, localStorage));
})();