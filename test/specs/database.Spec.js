import * as barn from '../../src/barn'

describe('Database', function () {
  it('should new a database', function () {
    var today = barn.database('today', 1)
    expect(today.name).toBe('today')
    expect(today.version).toBe(1)
  })

  it('should open one db success', function (done) {
    var today = barn.database('today', 1)
    var eventSchema = new barn.Schema({
      keyPath: 'id'
    })
    today.model('event', eventSchema)
    today.open().then(function (message) {
      expect(message).toBeDefined()
      done()
    }, function (error) {
      console.log(error)
    })
  })
})