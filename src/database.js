import * as Model from './model'

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction
export var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

export class Database {
  constructor(name, version) {
    this.name = name
    this.version = version || 1
    this.models = []
  }
  model(name, schema) {
    return this.models[name] = new Model(schema)
  }
  open() {
    if (!this.opened) {
      this.opened = new Promise((resolve, reject) => {
        var request = indexedDB.open(this.name, this.version)

        request.onerror = event => {
          delete this.opened
          reject(event.currentTarget.error)
        }

        request.onsuccess = event => {
          this.db = event.target.result
          resolve('open db success')
        }

        request.onupgradeneeded = event => {
          this.db = event.target.result
          try {
            if (event.oldVersion === 0) {
              this.onCreate()
            } else {
              this.onUpgrade(event)
            }
          } catch (error) {
            reject(error)
          }          
        }

      })
    }
    return this.opened
  }
  onCreate() {
    var name, model
    var store
    var indexes, index
    for (var name in this.models) {
      if (this.models.hasOwnproperty(name)) {
        model = this.models[name]
        store = this.db.createObjectStore(name, {
          keyPath: model.schema.keyPath,
          autoIncrement: true
        })
        indexes = model.schema.indexes || []
        for (index of indexes) {
          store.createIndex(index.name, index.keyPath, index.options)
        }
      }
    }
  }
  onUpgrade (event) {
    for (var name in this.models) {
      if (this.models.hasOwnproperty(name)) {
        this.models[name].schema.onUpgrade(event)
      } 
    }
  }
}