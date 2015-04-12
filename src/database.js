import {Model} from './model'

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction
export var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

export class Database {
  constructor(options = {}) {
    if (typeof indexedDB == 'undefined') {
      throw new Error('indexedDB is unsupported!')
      return
    }
    this.name = options.name
    this.version = options.version || 1
    this.onUpgrade = options.onUpgrade || this.onUpgrade
    this.models = []
  }
  model(name, schema) {
    var model = this.models[name] = new Model(schema)
    model.name = name
    model.db = this
    return model
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
              this.__onCreate()
            } else {
              this.__onUpgrade(event)
            }
          } catch (error) {
            reject(error)
          }          
        }

      })
    }
    return this.opened
  }
  destroy() {
    return new Promise((resolve, reject) => {
      var request = indexedDB.deleteDatabase(this.name)
      
      request.onerror = function (event) {
        reject(event.currentTarget.error)
      }

      request.onsuccess = function (event) {
        resolve('delete success')
      }
      
    })
  }
  add(name, data) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readwrite')

        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var request = store.add(data)

        request.onsuccess = (event) => {
          data[this.models[name].schema.keyPath] = request.result
          resolve(data)
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }

      })
    })
  }
  get(name, id) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readwrite')

        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var request = store.get(id)

        request.onsuccess = (event) => {
          resolve(request.result)
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }
      })
    })
  }
  getAll(name) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readwrite')
        var all = []
        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var request = store.openCursor()

        request.onsuccess = (event) => {
          var cursor = event.target.result
          if (cursor) {
            all.push(cursor.value)
            cursor.continue()
          } else {
            resolve(all)
          }
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }
      })
    })
  }
  getByIndex(name, keyPath, keyRange) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readwrite')
        var all = []
        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var index = store.index(keyPath)
        var request = index.openCursor(keyRange)

        request.onsuccess = (event) => {
          var cursor = event.target.result
          if (cursor) {
            all.push(cursor.value)
            cursor.continue()
          } else {
            resolve(all)
          }
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }
      })
    })
  }
  put(name, data) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readwrite')

        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var request = store.put(data)

        request.onsuccess = (event) => {
          resolve(data)
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }
      })
    })
  }
  remove(name, id) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readwrite')

        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var request = store.delete(id)

        request.onsuccess = (event) => {
          resolve(id)
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }
      })
    })
  }
  removeByIndex(name, keyPath, keyRange) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readwrite')

        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var index = store.index(keyPath)
        var request = index.openCursor(keyRange)

        request.onsuccess = (event) => {
          var cursor = event.target.result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          } else {
            resolve('success delete')
          }
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }
      })
    })
  }
  count(name, keyOrKeyRange) {
    return this.open().then(() => {
      return new Promise((resolve, reject) => {
        var transaction = this.db.transaction(name, 'readonly')

        transaction.onerror = (event) => {
          reject(event.currentTarget.error)
        }

        var store = transaction.objectStore(name)
        var request = store.count(keyOrKeyRange)

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = (event) => {
          reject(event.currentTarget.error)
        }
      })      
    })
  }
  clear(name) {
    return this.open().then(() => {
      var names = []
      if (name) {
        names = [name]
      } else {
        names = Object.keys(this.models)
      }
      return Promise.all(names.map((name) => {
        return new Promise((resolve, reject) => {
          var transaction = this.db.transaction(name, 'readwrite')

          transaction.onerror = (event) => {
            reject(event.currentTarget.error)
          }

          var store = transaction.objectStore(name)
          var request = store.clear()

          request.onsuccess = (event) => {
            resolve(request.result)
          }

          request.onerror = (event) => {
            reject(event.currentTarget.error)
          }
        })        
      }))
    })
  }
  __onCreate() {
    var name, model
    var store
    var indexes, index
    for (var name in this.models) {
      if (this.models.hasOwnProperty(name)) {
        model = this.models[name]
        store = this.db.createObjectStore(name, {
          keyPath: model.schema.keyPath,
          autoIncrement: true
        })
        indexes = model.schema.indexes
        for (index of indexes) {
          store.createIndex(index.name, index.keyPath, index.options)
        }
      }
    }
  }
  __onUpgrade (event) {
    this.onUpgrade()
    for (var name in this.models) {
      if (this.models.hasOwnproperty(name)) {
        this.models[name].schema.onUpgrade(event)
      } 
    }
  }
}