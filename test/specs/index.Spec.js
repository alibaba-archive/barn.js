import * as barn from '../../src/barn'
import * as Chance from 'chance'

var chance = new Chance

var Schema = barn.Schema

describe('Index', function () {
  beforeEach(function () {
    var today = barn.database({
      name: 'todayForTestIndex',
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
    this.EventModel = today.model('event', eventSchema)
    this.isSyncIndex = this.EventModel.index('isSync')
  })

  it('opt events by only filter', function (done) {
    var isSyncIndexValue = chance.guid()

    this.EventModel.putBatch([
      {isSync: isSyncIndexValue},
      {isSync: isSyncIndexValue}
    ]).then(() => {
      return this.isSyncIndex.only(isSyncIndexValue).query()
    }).then((events) => {
      expect(events.length == 2).toBe(true)
      return this.isSyncIndex.only(isSyncIndexValue).remove()
    }).then(() => {
      return this.isSyncIndex.only(isSyncIndexValue).query()
    }).then(function (events) {
      expect(events.length).toBe(0)
      done()
    }, function (error) {
      console.log(error)
    })  
  })

  it('opt events by between filter', function (done) {
    var isSyncIndexValue = chance.guid()
    this.EventModel.putBatch([
      {isSync: 1},
      {isSync: -1},
      {isSync: 31},
      {isSync: 0},
      {isSync: 2}
    ]).then(() => {
      return this.isSyncIndex.between(1, 32).query()
    }).then((events) => {
      expect(events.length).toBe(3)
      return this.isSyncIndex.between(-10, 32, false, false).remove()
    }).then(() => {
      return this.isSyncIndex.between(1, 32).query()
    }).then(function (events) {
      expect(events.length).toBe(0)
      done()
    }, function (error) {
      console.log(error)
    })  
  })

  it('opt events by lt filter', function (done) {
    var isSyncIndexValue = chance.guid()
    this.EventModel.putBatch([
      {isSync: 1, mark: 'lt'},
      {isSync: -1, mark: 'lt'},
      {isSync: 31, mark: 'lt'},
      {isSync: 0, mark: 'lt'},
      {isSync: 2, mark: 'lt'}
    ]).then(() => {
      return this.isSyncIndex.lt(1, true).query()
    }).then((events) => {
      expect(events.length).toBe(2)
      return this.isSyncIndex.lt(32).remove()
    }).then(() => {
      return this.isSyncIndex.lt(32, true).query()
    }).then(function (events) {
      expect(events.length).toBe(0)
      done()
    }, function (error) {
      console.log(error)
    })  
  })

  it('opt events by gt filter', function (done) {
    var isSyncIndexValue = chance.guid()
    this.EventModel.putBatch([
      {isSync: 1, mark: 'gt'},
      {isSync: -1, mark: 'gt'},
      {isSync: 31, mark: 'gt'},
      {isSync: 0, mark: 'gt'},
      {isSync: 2, mark: 'gt'}
    ]).then(() => {
      return this.isSyncIndex.gt(1, true).query()
    }).then((events) => {
      expect(events.length).toBe(2)
      return this.isSyncIndex.gt(-2).remove()
    }).then(() => {
      return this.isSyncIndex.gt(-2, true).query()
    }).then(function (events) {
      expect(events.length).toBe(0)
      done()
    }, function (error) {
      console.log(error)
    })  
  })
})