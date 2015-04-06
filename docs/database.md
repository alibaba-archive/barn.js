# Database

对应 indexeddb 里面的一张表。

## 创建数据库

> **注意：** 这里的数据库创建只是一种记录，只有通过 `open()` 方法真正打开数据库是才会创建对应的数据库。

```javascript
import * as barn from 'barn'

// barn.database(name, version)
var today = barn.database('today', 1)
```

## open()

打开数据库，创建数据表，一个数据库在一个运行时中只会被打开一次。

### return

promise 对象。

```javascript
today.open().then(function () {
  // open db success
}, function (error) {
  console.log(error)
})
```