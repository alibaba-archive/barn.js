import * as Database from './database'

export default class Model {
  constructor(schema) {
    this.schema = schema
  }
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
  clear() {
    return this.db.clear(this.name)
  }
}