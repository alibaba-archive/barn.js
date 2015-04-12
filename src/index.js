import {IDBKeyRange} from './database'

export class Index {
  constructor(db, name, indexName) {
    this.db = db
    this.name = name
    this.indexName = indexName
  }

  make(keyRange) {
    return {
      query: () => {
        return this.query(keyRange)
      },
      remove: () => {
        return this.remove(keyRange)
      }
    }
  }

  // keyRange
  only(value) {
    var keyRange = IDBKeyRange.only(value)
    return this.make(keyRange)
  }

  between(start, end, startedOpened, endOpened) {
    var keyRange = IDBKeyRange.bound(start, end, startedOpened, endOpened)
    return this.make(keyRange)
  }

  lt(end, endOpened) {
    var keyRange = IDBKeyRange.upperBound(end, endOpened)
    return this.make(keyRange)
  }

  gt(start, startOpened) {
    var keyRange = IDBKeyRange.lowerBound(start, startOpened)
    return this.make(keyRange)
  }

  // opt
  query(keyRange) {
    return this.db.getByIndex(this.name, this.indexName, keyRange)
  }

  remove(keyRange) {
    return this.db.removeByIndex(this.name, this.indexName, keyRange)
  }
}