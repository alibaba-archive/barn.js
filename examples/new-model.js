import 'barn' as barn

var schema = new barn.Schema({
  keyPath: 'id'
})

var Event = barn.model('event', schema)