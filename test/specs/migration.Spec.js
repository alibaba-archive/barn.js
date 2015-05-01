import * as barn from '../../src/barn'

describe('Migration', function () {
  it('should update db version success', function (done) {
    var migrationDB1 = barn.database({
      name: 'migration',
      version: 1
    })
    var EventModel =migrationDB1.model('event', new barn.Schema({
      keyPath: 'id'
    }))
    var  migrationDB2 = barn.database({
      name: 'migration',
      version: 2
    })
    var newEventModel =migrationDB2.model('event', new barn.Schema({
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
          var transaction = event.target.transaction
          store = transaction.objectStore('event')
          store.createIndex('synced', 'synced', {
            unique: false,
            multiEntry: false
          })
        }
      }
    }))
    EventModel.add({
      name: 'migration'
    }).then(function () {
      migrationDB1.close()
      return newEventModel.getAll()
    }).then(function (events) {
      expect(events.length > 0).toBe(true)
      done()
    })
  })
})
