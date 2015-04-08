import * as barn from '../../src/barn'
import * as Chance from 'chance'

var chance = new Chance

var Schema = barn.Schema

describe('Model', function () {
  it('should new a Model', function () {
    var today = barn.database({
      name: 'today',
      version: 1
    })
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

  describe('can', function () {
    beforeEach(function () {
      this.EventModel = barn.database({
        name: 'today1',
        version: 1
      }).model('event', new barn.Schema({
        keyPath: 'id',
        indexes: [{
          name: 'isSync',
          keyPath: 'isSync',
          options: {
            unique: false,
            multiEntry: false
          }
        }]
      }))
    })

    it('add event to database', function (done) {
      this.EventModel.add({
        startDate: new Date(),
        endDate: new Date
      }).then(function (event) {
        expect(event.id).toBeDefined()
        done()
      }, function (error) {
        console.log(error)
      })
    })

    it('get event from database by keyPath', function (done) {
      var startDate = new Date()
      this.EventModel.add({
        startDate: startDate
      }).then((event) => {
        return this.EventModel.get(event.id)
      }).then(function (event) {
        expect(event.startDate.getTime()).toBe(startDate.getTime())
        done()
      }, function (error) {
        console.log(error)
      })
    })

    it('put event in database', function (done) {
      var id;
      var startDate = new Date()
      this.EventModel.add({
        startDate: startDate
      }).then((event) => {
        event.startDate = new Date()
        id = event.id
        return this.EventModel.put(event)
      }).then((event) => {
        return this.EventModel.get(id)
      }).then(function (event) {
        expect(event.startDate.getTime() - startDate.getTime()).not.toBe(0)
        done()
      }, function (error) {
        console.log(error)
      })
    })

    it('remove event in database', function (done) {
      var id;
      this.EventModel.add({
        startDate: new Date()
      }).then((event) => {
        event.startDate = new Date()
        id = event.id
        return this.EventModel.remove(id)
      }).then(function (removedId) {
        expect(id).toBe(removedId)
        done()
      }, function (error) {
        console.log(error)
      })
    })

    it('get all event from dbs', function (done) {
      this.EventModel.add({
        startDate: new Date
      }).then(() => {
        return this.EventModel.add({
          startDate: new Date
        })
      }).then(() => {
        return this.EventModel.getAll()
      }).then((events) => {
        expect(events.length >= 2).toBe(true)
        done()
      }, function (error) {
        console.log(error)
      })
    })

    it('get events by index', function (done) {
      this.EventModel.add({
        startDate: new Date,
        isSync: 'YES'
      }).then(() => {
        return this.EventModel.add({
          startDate: new Date,
          isSync: 'YES'
        })
      }).then(() => {
        return this.EventModel.getByIndex('isSync', 'YES')
      }).then((events) => {
        expect(events.length >= 2).toBe(true)
        done()
      }, function (error) {
        console.log(error)
      })
    })

    it('remove events by index', function (done) {
      var originCount
      this.EventModel.getAll().then((events) => {
        originCount = events.length
        return this.EventModel.add({
          startDate: new Date,
          isSync: 'removeByIndex'
        }).then(()=> {
          return this.EventModel.add({
            startDate: new Date,
            isSync: 'removeByIndex'
          })
        }).then(() => {
          return this.EventModel.getAll()
        })
      }).then((events) => {
        expect(events.length - originCount).toBe(2)
        return this.EventModel.removeByIndex('isSync', 'removeByIndex').then(() => {
          return this.EventModel.getAll()
        })
      }).then((events) => {
        expect(events.length == originCount).toBe(true)
        done()
      }, function (error) {
        console.log(error)
      })
    })

    it('count all events in database', function (done) {
      Promise.all([this.EventModel.getAll(), this.EventModel.count()])
        .then(function (results) {
          expect(results[0].length).toBe(results[1])
          done()
        }, function (error) {
          console.log(error.stack)
        })
    })

    it('clear all event', function (done) {
      this.EventModel.add({
        startDate: new Date
      }).then(() => {
        return this.EventModel.getAll()
      }).then((events) => {
        expect(events.length >= 1).toBe(true)
      }).then(() => {
        return this.EventModel.clear().then(() => {
          return this.EventModel.getAll()
        })
      }).then((events) => {
        expect(events.length == 0).toBe(true)
        done()
      })
    })

    it('put batch data in to database', function (done) {
      var isSyncIndexValue = chance.guid()
      var oldIsSyncIndexValue = chance.guid()
      expect(isSyncIndexValue != oldIsSyncIndexValue).toBe(true)
      var rawEvents = [
        {isSync: isSyncIndexValue},
        {isSync: isSyncIndexValue},
        {isSync: isSyncIndexValue}
      ]
      this.EventModel.add({
        isSync: oldIsSyncIndexValue
      }).then((event) => {
        expect(event.isSync).toBe(oldIsSyncIndexValue)
        event.isSync = isSyncIndexValue
        rawEvents.push(event)
        return this.EventModel.putBatch(rawEvents)
      }).then(() => {
        return this.EventModel.getByIndex('isSync', isSyncIndexValue)
      }).then(function (events) {
        expect(rawEvents.length).toBe(events.length)
        done()
      }, function (error) {
        console.log(error.stack)
      })
    })

    it('remove batch event from database', function (done) {
      var isSyncIndexValue = chance.guid()
      var rawEvents = [
        {isSync: isSyncIndexValue},
        {isSync: isSyncIndexValue},
        {isSync: isSyncIndexValue}
      ]
      this.EventModel.putBatch(rawEvents).then(() => {
        return this.EventModel.getByIndex('isSync', isSyncIndexValue)
      }).then((events) => {
        expect(events.length).toBe(3)
        events.push({
          isSync: 'something else'
        })
        return this.EventModel.removeBatch(events)
      }).then(() => {
        return this.EventModel.getByIndex('isSync', isSyncIndexValue)
      }).then(function (events) {
        expect(events.length).toBe(0)
        done()
      }, function (error) {
        console.log(error.stack)
      })
    })

    it('batch anything to database', function (done) {
      var isSyncIndexValue = chance.guid()
      var anotherIsSyncIndexValue = chance.guid()
      var rawEvents = [
        {isSync: isSyncIndexValue},
        {isSync: isSyncIndexValue},
        {isSync: isSyncIndexValue}
      ]
      this.EventModel.putBatch(rawEvents).then(() => {
        return this.EventModel.getByIndex('isSync', isSyncIndexValue)
      }).then((events) => {
        expect(events.length).toBe(3)
        var batches = [
          {
            opt:'add',
            value: {isSync: isSyncIndexValue},
          },
          {
            opt:'put',
            value: Object.assign(events[0], {
              isSync: anotherIsSyncIndexValue
            }),
          },
          {
            opt:'remove',
            value: events[1],
          }
        ]
        return this.EventModel.batch(batches)
      }).then(() => {
        return Promise.all([
          this.EventModel.getByIndex('isSync', isSyncIndexValue),
          this.EventModel.getByIndex('isSync', anotherIsSyncIndexValue)
        ])
      }).then(function (results) {
        expect(results[0].length).toBe(2)
        expect(results[1].length).toBe(1)
        done()
      }, function (error) {
        console.log(error.stack)
      })
    })
  })
})