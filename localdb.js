
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
        _classCallCheck(this, LocalDB);

        this.db = name;
      }

      _createClass(LocalDB, [{
        key: 'get',
        value: function get() {
          return JSON.parse(LS.getItem(this.db));
        }
      }]);

      return LocalDB;
    })();

    return LocalDB;
  };(function (context, name, definition) {
    if (typeof module !== 'undefined') {
      modul.exports = definition;
    } else if (typeof context !== 'undefined') {
      context[name] = definition;
    }
  })(window, 'localdb', definition(window, localStorage));
})();