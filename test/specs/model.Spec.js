import * as barn from '../../src/barn'
var Schema = barn.Schema

describe('Model', function () {
  it('should new a Model', function () {
    var today = barn.database('today', 1)
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
    var Event = today.model('event', eventSchema)

    expect(Event.schema.keyPath).toBe('id')
  })
})