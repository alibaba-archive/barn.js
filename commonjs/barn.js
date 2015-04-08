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