import * as Schema from'./schema'
import {Database, IDBKeyRange} from './database'
import * as Model from './model'

class Barn {
  constructor() {
  }
  database(name, version) {
    return new Database(name, version)
  }
}

var barn = new Barn

barn.Schema = Schema

export default barn