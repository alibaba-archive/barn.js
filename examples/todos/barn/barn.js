'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Schema = require('./schema');

var _Database$IDBKeyRange = require('./database');

var _Model = require('./model');

var barn = {
  database: function database(name, version) {
    return new _Database$IDBKeyRange.Database(name, version);
  }
};

barn.Schema = _Schema.Schema;
barn.IDBKeyRange = _Database$IDBKeyRange.IDBKeyRange;

exports['default'] = barn;
module.exports = exports['default'];