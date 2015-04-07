# Models

基于 Schema 创建，可用来操作对应的数据库表。

## 生成 Model

```javascript
import * as barn from 'barn'

var schema = new barn.Schema({
  keyPath: 'id',
  indexes: [{
    name: 'isSync',
    keyPath: 'isSync'
  }]
})

var today = barn.database('today', 1)

var Event = today.model('event', schema)
```

## add

新增数据。

```javascript
Event.add({
  startDate: new Date(),
  endDate: new Date(),
  isSync: 'YES'
}).then(function (event) {
  // do something with event
})
```

## get

根据 `keyPath` 获取对应的数据。

```javascript
Event.get(20).then(function (event) {
  // do something with event
})
```

## getAll

获取所有对象。

```javascript
Event.getAll().then(function (events) {
  // do something with events
})
```

## getByIndex

通过索引查询所有匹配的数据

```javascript
Event.getByIndex().then(function (events) {
  // do something with events
})
```

## put

更新数据，必须传递一个 `keyPath` 值。

```javascript
Event.put({
  id: 13,
  startDate: new Date()
}).then(function(event) {
  // event
})
```

## remove(id)

根据 `keyPath` 删除数据。

```javascript
Event.remove(20).then(function(id) {
  // id is the keyPath value of removed item
})
```

## removeByIndex

根据索引删除所有匹配的数据：

```javascript
Event.removeByIndex('isSync', 'YES').then(function() {
  // success delete
})
```

## clear

清除表中的所有数据

```javascript
Event.clear().then(function() {
  // success clear
})
```

