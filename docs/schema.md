# Schemas

用来定义数据库中的一张表，在 indexeddb 中表的字段是无需定义的，只需要定义表的主键、索引等等。

## 定义 Schema

``` javascript
import * as barn from 'barn'

var Schema = barn.Schema

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
```