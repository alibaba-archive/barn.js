'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Model = require('./model');

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

exports.IDBKeyRange = IDBKeyRange;

var Database = (function () {
  function Database() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Database);

    if (typeof indexedDB == 'undefined') {
      throw new Error('indexedDB is unsupported!');
      return;
    }
    this.name = options.name;
    this.version = options.version || 1;
    this.onUpgrade = options.onUpgrade || this.onUpgrade;
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
      var model = this.models[name] = new _Model.Model(schema);
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
                _this.__onCreate();
              } else {
                _this.__onUpgrade(event);
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
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var request = indexedDB.deleteDatabase(_this2.name);

        request.onerror = function (event) {
          reject(event.currentTarget.error);
        };

        request.onsuccess = function (event) {
          resolve('delete success');
        };
      });
    }
  }, {
    key: 'add',
    value: function add(name, data) {
      var _this3 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this3.db.transaction(name, 'readwrite');

          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var request = store.add(data);

          request.onsuccess = function (event) {
            data[_this3.models[name].schema.keyPath] = request.result;
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
      var _this4 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this4.db.transaction(name, 'readwrite');

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
      var _this5 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this5.db.transaction(name, 'readwrite');
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
      var _this6 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this6.db.transaction(name, 'readwrite');
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
      var _this7 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this7.db.transaction(name, 'readwrite');

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
      var _this8 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this8.db.transaction(name, 'readwrite');

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
      var _this9 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this9.db.transaction(name, 'readwrite');

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
    key: 'count',
    value: function count(name, keyOrKeyRange) {
      var _this10 = this;

      return this.open().then(function () {
        return new Promise(function (resolve, reject) {
          var transaction = _this10.db.transaction(name, 'readonly');

          transaction.onerror = function (event) {
            reject(event.currentTarget.error);
          };

          var store = transaction.objectStore(name);
          var request = store.count(keyOrKeyRange);

          request.onsuccess = function () {
            resolve(request.result);
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
      var _this11 = this;

      return this.open().then(function () {
        var names = [];
        if (name) {
          names = [name];
        } else {
          names = Object.keys(_this11.models);
        }
        return Promise.all(names.map(function (name) {
          return new Promise(function (resolve, reject) {
            var transaction = _this11.db.transaction(name, 'readwrite');

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
    key: '__onCreate',
    value: function __onCreate() {
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
    key: '__onUpgrade',
    value: function __onUpgrade(event) {
      this.onUpgrade();
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