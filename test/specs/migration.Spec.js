import * as barn from '../../src/barn'

describe('Migration', function () {
  beforeEach(function () {
    this.EventModel = barn.database({
      name: 'migration',
      version: 1
    }).model('event', new barn.Schema({
      keyPath: 'id'
    }))
  })

  it('should update db version success', function (done) {
    var newEventModel = barn.database({
      name: 'migration',
      version: 2
    }).model('event', new barn.Schema({
      keyPath: 'id',
      indexes: [{
        name: 'synced',
        keyPath: 'synced',
        options: {
          unique: false,
          multiEntry: false
        }
      }],
      onUpgrade: function (event) {
        var store
        if (event.oldVersion <= 1) {
          store = event.db.objectStore('event')
          store.createIndex('synced', 'synced', {
            unique: false,
            multiEntry: false
          })
        }
      }
    }))
    this.EventModel.add({
      name: 'migration'
    }).then(function () {
      return newEventModel.getAll()
    }).then(function (events) {
      expect(events.length > 0).toBe(true)
      done()
    }, function (error) {
      console.log(error.stack)
    })
  })
})