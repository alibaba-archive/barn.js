import * as barn from 'barn'

var Schema = barn.Schema

var eventSchema = new Schema({
  keyPath: 'id',
  indexes: [{
    name: 'isSync',
    keyPath: 'isSync',
    options: {
      unique: false,
      multiEntry: false
    }
  }]
})