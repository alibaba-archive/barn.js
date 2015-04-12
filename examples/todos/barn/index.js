'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _IDBKeyRange = require('./database');

var Index = (function () {
  function Index(db, name, indexName) {
    _classCallCheck(this, Index);

    this.db = db;
    this.name = name;
    this.indexName = indexName;
  }

  _createClass(Index, [{
    key: 'make',
    value: function make(keyRange) {
      var _this = this;

      return {
        query: function query() {
          return _this.query(keyRange);
        },
        remove: function remove() {
          return _this.remove(keyRange);
        }
      };
    }
  }, {
    key: 'only',

    // keyRange
    value: function only(value) {
      var keyRange = _IDBKeyRange.IDBKeyRange.only(value);
      return this.make(keyRange);
    }
  }, {
    key: 'between',
    value: function between(start, end, startedOpened, endOpened) {
      var keyRange = _IDBKeyRange.IDBKeyRange.bound(start, end, startedOpened, endOpened);
      return this.make(keyRange);
    }
  }, {
    key: 'lt',
    value: function lt(end, endOpened) {
      var keyRange = _IDBKeyRange.IDBKeyRange.upperBound(end, endOpened);
      return this.make(keyRange);
    }
  }, {
    key: 'gt',
    value: function gt(start, startOpened) {
      var keyRange = _IDBKeyRange.IDBKeyRange.lowerBound(start, startOpened);
      return this.make(keyRange);
    }
  }, {
    key: 'query',

    // opt
    value: function query(keyRange) {
      return this.db.getByIndex(this.name, this.indexName, keyRange);
    }
  }, {
    key: 'remove',
    value: function remove(keyRange) {
      return this.db.removeByIndex(this.name, this.indexName, keyRange);
    }
  }]);

  return Index;
})();

exports.Index = Index;