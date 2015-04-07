import * as Schema from'./schema'
import {Database, IDBKeyRange} from './database'
import * as Model from './model'

var barn = {
  database: function(name, version) {
    return new Database(name, version)
  }
}

barn.Schema = Schema
barn.IDBKeyRange = IDBKeyRange

export default barn