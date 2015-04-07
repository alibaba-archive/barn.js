(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _import = require('../src/barn');

var barn = _interopRequireWildcard(_import);

if (typeof define === 'function' && define.amd) {
  define([], function () {
    return barn['default'];
  });
} else {
  window.barn = barn['default'];
}

},{"../src/barn":2}],2:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('./schema');

var Schema = _interopRequireWildcard(_import);

var _Database$IDBKeyRange = require('./database');

var _import2 = require('./model');

var Model = _interopRequireWildcard(_import2);

var barn = {
  database: function database(name, version) {
    return new _Database$IDBKeyRange.Database(name, version);
  }
};

barn.Schema = Schema;
barn.IDBKeyRange = _Database$IDBKeyRange.IDBKeyRange;

exports['default'] = barn;
module.exports = exports['default'];

},{"./database":3,"./model":4,"./schema":5}],3:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('./model');

var Model = _interopRequireWildcard(_import);

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

exports.IDBKeyRange = IDBKeyRange;

var Database = (function () {
  function Database(name, version) {
    _classCallCheck(this, Database);

    this.name = name;
    this.version = version || 1;
    this.models = [];
  }

  _createClass(Database, [{
    key: 'model',
    value: (function (_model) {
      function model(_x, _x2) {
        return _model.apply(this, arguments);
      }

      model.toString = function () {
        return _model.toString();
      };

      return model;
    })(function (name, schema) {
      var model = this.models[name] = new Model(schema);
      model.name = name;
      model.db = this;
      return model;
    })
  }, {
    key: 'open',
    value: function open() {
      var _this = this;

      if (!this.opened) {
        this.opened = new Promise(function (resolve, reject) {
          var request = indexedDB.open(_this.name, _this.version);

          request.onerror = function (event) {
            delete _this.opened;
            reject(event.currentTarget.error);
          };

          request.onsuccess = function (event) {
            _this.db = event.target.result;
            resolve('open db success');
          };

          request.onupgradeneeded = function (event) {
            _this.db = event.target.result;
            try {
              if (event.oldVersion === 0) {
                _this.onCreate();
              } else {
                _this.onUpgrade(event);
              }
            } catch (error) {
              reject(error);
            }
          };
        });
      }
      return this.opened;
    }
  }, {
    key: 'add',
    value: function add(name, data) {
      var _this2 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this2.db.transaction(name, 'readwrite');

          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var request = store.add(data);

          request.onsuccess = function (event) {
            data[_this2.models[name].schema.keyPath] = request.result;
            resolve(data);
          };

          request.onerror = function (event) {
            reject(event.currentTarget.error);
          };
        });
      });
    }
  }, {
    key: 'get',
    value: function get(name, id) {
      var _this3 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this3.db.transaction(name, 'readwrite');

          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var request = store.get(id);

          request.onsuccess = function (event) {
            resolve(request.result);
          };

          request.onerror = function (event) {
            reject(event.currentTarget.error);
          };
        });
      });
    }
  }, {
    key: 'getAll',
    value: function getAll(name) {
      var _this4 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this4.db.transaction(name, 'readwrite');
          var all = [];
          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var request = store.openCursor();

          request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
              all.push(cursor.value);
              cursor['continue']();
            } else {
              resolve(all);
            }
          };

          request.onerror = function (event) {
            reject(event.currentTarget.error);
          };
        });
      });
    }
  }, {
    key: 'getByIndex',
    value: function getByIndex(name, keyPath, keyRange) {
      var _this5 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this5.db.transaction(name, 'readwrite');
          var all = [];
          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var index = store.index(keyPath);
          var request = index.openCursor(keyRange);

          request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
              all.push(cursor.value);
              cursor['continue']();
            } else {
              resolve(all);
            }
          };

          request.onerror = function (event) {
            reject(event.currentTarget.error);
          };
        });
      });
    }
  }, {
    key: 'put',
    value: function put(name, data) {
      var _this6 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this6.db.transaction(name, 'readwrite');

          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var request = store.put(data);

          request.onsuccess = function (event) {
            resolve(data);
          };

          request.onerror = function (event) {
            reject(event.currentTarget.error);
          };
        });
      });
    }
  }, {
    key: 'remove',
    value: function remove(name, id) {
      var _this7 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this7.db.transaction(name, 'readwrite');

          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var request = store['delete'](id);

          request.onsuccess = function (event) {
            resolve(id);
          };

          request.onerror = function (event) {
            reject(event.currentTarget.error);
          };
        });
      });
    }
  }, {
    key: 'removeByIndex',
    value: function removeByIndex(name, keyPath, keyRange) {
      var _this8 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this8.db.transaction(name, 'readwrite');

          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var index = store.index(keyPath);
          var request = index.openCursor(keyRange);

          request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
              cursor['delete']();
              cursor['continue']();
            } else {
              resolve('success delete');
            }
          };

          request.onerror = function (event) {
            reject(event.currentTarget.error);
          };
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear(name) {
      var _this9 = this;

      return this.open().then(function () {
        var names = [];
        if (name) {
          names = [name];
        } else {
          names = Object.keys(_this9.models);
        }
        return Promise.all(names.map(function (name) {
          return new Promise(function (resolve, reject) {
            var transaction = _this9.db.transaction(name, 'readwrite');

            transaction.onerror = function (event) {
              reject(event.currentTarget.error);
            };

            var store = transaction.objectStore(name);
            var request = store.clear();

            request.onsuccess = function (event) {
              resolve(request.result);
            };

            request.onerror = function (event) {
              reject(event.currentTarget.error);
            };
          });
        }));
      });
    }
  }, {
    key: 'onCreate',
    value: function onCreate() {
      var name, model;
      var store;
      var indexes, index;
      for (var name in this.models) {
        if (this.models.hasOwnProperty(name)) {
          model = this.models[name];
          store = this.db.createObjectStore(name, {
            keyPath: model.schema.keyPath,
            autoIncrement: true
          });
          indexes = model.schema.indexes;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = indexes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              index = _step.value;

              store.createIndex(index.name, index.keyPath, index.options);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }
  }, {
    key: 'onUpgrade',
    value: function onUpgrade(event) {
      for (var name in this.models) {
        if (this.models.hasOwnproperty(name)) {
          this.models[name].schema.onUpgrade(event);
        }
      }
    }
  }]);

  return Database;
})();

exports.Database = Database;

},{"./model":4}],4:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('./database');

var Database = _interopRequireWildcard(_import);

var Model = (function () {
  function Model(schema) {
    _classCallCheck(this, Model);

    this.schema = schema;
  }

  _createClass(Model, [{
    key: 'add',
    value: function add(data) {
      return this.db.add(this.name, data);
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.db.get(this.name, id);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.db.getAll(this.name);
    }
  }, {
    key: 'getByIndex',
    value: function getByIndex(keyPath, keyRange) {
      return this.db.getByIndex(this.name, keyPath, keyRange);
    }
  }, {
    key: 'put',
    value: function put(data) {
      return this.db.put(this.name, data);
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      return this.db.remove(this.name, id);
    }
  }, {
    key: 'removeByIndex',
    value: function removeByIndex(keyPath, keyRange) {
      return this.db.removeByIndex(this.name, keyPath, keyRange);
    }
  }, {
    key: 'clear',
    value: function clear() {
      return this.db.clear(this.name);
    }
  }]);

  return Model;
})();

exports['default'] = Model;
module.exports = exports['default'];

},{"./database":3}],5:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Schema = (function () {
  function Schema() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Schema);

    this.keyPath = options.keyPath;
    this.indexes = options.indexes || [];
    this.onUpgrade = options.onUpgrade || this.onUpgrade;
  }

  _createClass(Schema, [{
    key: "onUpgrade",
    value: function onUpgrade() {}
  }]);

  return Schema;
})();

exports["default"] = Schema;
module.exports = exports["default"];

},{}]},{},[1])