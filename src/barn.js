// http://w3c.github.io/IndexedDB/
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

import {Schema} from'./schema'
import {Database, IDBKeyRange} from './database'
import {Model} from './model'

var barn = {
  database: function(options = {}) {
    return new Database(options)
  }
}

barn.Schema = Schema
barn.IDBKeyRange = IDBKeyRange

export default barn
