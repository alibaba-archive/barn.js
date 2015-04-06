import * as barn from '../../src/barn'

var Schema = barn.Schema

describe('Schema', function () {
  it('should new a schema', function () {
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
    expect(eventSchema.keyPath).toBe('id')
  })
})