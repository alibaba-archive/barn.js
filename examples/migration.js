import * as barn from 'barn'

var today = barn.database('today', 1)

var schema = new barn.Schema({
  keyPath: 'id'
})
var Event = barn.model('event', schema)