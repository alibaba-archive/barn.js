# Models

基于 Schema 创建，可用来操作对应的数据库表。

## 生成 Model

```javascript
import * as barn from 'barn'

var schema = new barn.Schema({
  keyPath: 'id'
})

var today = barn.database('today', 1)

var Event = today.model('event', schema)
```