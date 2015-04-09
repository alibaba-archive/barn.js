import * as barn from '../../src/barn'

describe('Database', function () {
  beforeEach(function () {
    this.today = barn.database({
      name: 'today',
      version: 1
    })
    var eventSchema = new barn.Schema({
      keyPath: 'id'
    })
    var calendarSchema = new barn.Schema({
      keyPath: 'id'
    })
    this.event = this.today.model('event', eventSchema)
    this.calendar = this.today.model('calendar', eventSchema)
  })

  it('should new a database', function () {
    expect(this.today.name).toBe('today')
    expect(this.today.version).toBe(1)
  })

  it('should open one db success', function (done) {
    this.today.open().then(function (message) {
      expect(message).toBeDefined()
      done()
    }, function (error) {
      console.log(error)
    })
  })

  it('should clear all database', function (done) {
    Promise.all([
      this.event.add({start: new Date}),
      this.calendar.add({name: 'holiday'}),
    ]).then(() => {
      return Promise.all([
        this.event.getAll(),
        this.calendar.getAll()
      ])
    }).then((results) => {
      expect(results[0].length >= 1).toBe(true)
      expect(results[1].length >= 1).toBe(true)
      return this.today.clear().then(() => {
        return Promise.all([
          this.event.getAll(),
          this.calendar.getAll()
        ])
      })
    }).then((results) => {
      expect(results[0].length == 0).toBe(true)
      expect(results[1].length == 0).toBe(true)
      done()
    }, function(error) {
      console.log(error.stack)
    })
  })

  // it('should delete itself', function (done) {
  //   var today1 = barn.database('today1')
  //   today1.open().then(function () {
  //     return today1.destroy()
  //   }).then(function () {
  //     done()
  //   }, function (error) {
  //     console.log(error.stack)
  //   })
  // })

})