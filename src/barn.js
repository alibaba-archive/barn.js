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