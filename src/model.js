import {Index} from './index'

export class Model {
  constructor(schema) {
    this.schema = schema
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

[
  'add', 'get', 'getAll',
  'getByIndex', 'put', 'remove',
  'removeByIndex', 'count', 'clear'
].forEach(function (name) {
  Model.prototype[name] = function () {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(this.name)
    return this.db[name].apply(this.db, args)
  }
})