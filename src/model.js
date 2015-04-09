import * as Database from './database'
import * as Index from './index'

export default class Model {
  constructor(schema) {
    this.schema = schema
  }

  // proxy to database
  add(data) {
    return this.db.add(this.name, data)
  }
  get(id) {
    return this.db.get(this.name, id)
  }
  getAll() {
    return this.db.getAll(this.name)
  }
  getByIndex(keyPath, keyRange) {
    return this.db.getByIndex(this.name, keyPath, keyRange)
  }
  put(data) {
    return this.db.put(this.name, data)
  }
  remove(id) {
    return this.db.remove(this.name, id)
  }
  removeByIndex(keyPath, keyRange) {
    return this.db.removeByIndex(this.name, keyPath, keyRange)
  }
  count(keyOrKeyRange) {
    return this.db.count(this.name, keyOrKeyRange)
  }
  clear() {
    return this.db.clear(this.name)
  }

  //self method
  putBatch(items) {
    return Promise.all(items.map((item) => {
      var primaryKeyValue = item[this.schema.keyPath]

      if (primaryKeyValue) {
        return this.get(primaryKeyValue).then((data) => {
          if (data) {
            return this.put(Object.assign(data, item))
          } else {
            return this.add(item)
          }
        })
      } else {
        return this.add(item)
      }
    }))
  }

  removeBatch(items) {
    return Promise.all(items.map((item) => {
      var primaryKeyValue = item[this.schema.keyPath]
      if (primaryKeyValue) {
        return this.remove(primaryKeyValue)
      } else {
        return Promise.resolve('Not Found')
      }
    }))
  }

  batch(batches) {
    var primaryKeyPath = this.schema.keyPath
    return Promise.all(batches.map((batch) => {
      return this[batch.opt](batch.opt === 'remove' ? batch.value[primaryKeyPath] : batch.value)
    }))
  }

  // index
  index(indexName) {
    return new Index(this.db, this.name, indexName)
  }
}