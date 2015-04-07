# 数据迁移

`barn.js` 提供了非常灵活的数据迁移方案。

## version 1

`barn.database` 方法除了接受数据库名以外，还接受一个 `version` 参数，我们可以用来实现数据迁移。 

```javascript
import * as barn from 'barn'

// 目前 today 数据的 version 是 1
var today = barn.database('today', 1)

var schema = new barn.Schema({
  keyPath: 'id'
})
var Event = barn.model('event', schema)
```

## version 2

`Schema` 构造器接受一个 `onUpgrade`，我们可以基于它来实现数据迁移。

```javascript
import * as barn from 'barn'

// 目前 today 数据的 version 是 1
var today = barn.database('today', 2)

var schema = new barn.Schema({
  keyPath: 'id',
  indexes: [{
    name: 'isSync',
    keyPath: 'isSync'
  }],
  onUpgrade: function (event) {
    var store
    if (event.oldVersion <=1) {
      store = event.db.objectStore('event')
      store.createIndex('isSync', 'isSync')
    }

    // if (event.oldSersion <= 2) {
    //   // done something when current db version is great 2
    // }
  }
})
var Event = barn.model('event', schema)
```