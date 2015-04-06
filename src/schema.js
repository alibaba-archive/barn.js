export default class Schema {
  constructor(options={}) {
    this.keyPath = options.keyPath
    this.indexes = options.indexes
    this.onUpgrade = options.onUpgrade || this.onUpgrade
  }
  onUpgrade () {
    
  }
}