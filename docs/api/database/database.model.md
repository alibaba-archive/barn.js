## Database.model(modelName, schema)

创建一个数据模型，对应数据库中的一个 store。

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