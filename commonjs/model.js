'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('./database');

var Database = _interopRequireWildcard(_import);

var _import2 = require('./index');

var Index = _interopRequireWildcard(_import2);

var Model = (function () {
  function Model(schema) {
    _classCallCheck(this, Model);

    this.schema = schema;
  }

  _createClass(Model, [{
    key: 'add',

    // proxy to database
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
    key: 'count',
    value: function count(keyOrKeyRange) {
      return this.db.count(this.name, keyOrKeyRange);
    }
  }, {
    key: 'clear',
    value: function clear() {
      return this.db.clear(this.name);
    }
  }, {
    key: 'putBatch',

    //self method
    value: function putBatch(items) {
      var _this = this;

      return Promise.all(items.map(function (item) {
        var primaryKeyValue = item[_this.schema.keyPath];

        if (primaryKeyValue) {
          return _this.get(primaryKeyValue).then(function (data) {
            if (data) {
              return _this.put(Object.assign(data, item));
            } else {
              return _this.add(item);
            }
          });
        } else {
          return _this.add(item);
        }
      }));
    }
  }, {
    key: 'removeBatch',
    value: function removeBatch(items) {
      var _this2 = this;

      return Promise.all(items.map(function (item) {
        var primaryKeyValue = item[_this2.schema.keyPath];
        if (primaryKeyValue) {
          return _this2.remove(primaryKeyValue);
        } else {
          return Promise.resolve('Not Found');
        }
      }));
    }
  }, {
    key: 'batch',
    value: function batch(batches) {
      var _this3 = this;

      var keyPath = this.schema.keyPath;
      return Promise.all(batches.map(function (batch) {
        return _this3[batch.opt](batch.opt === 'remove' ? batch.value[keyPath] : batch.value);
      }));
    }
  }, {
    key: 'index',

    // index
    value: function index(indexName) {
      return new Index(indexName);
    }
  }]);

  return Model;
})();

exports['default'] = Model;
module.exports = exports['default'];