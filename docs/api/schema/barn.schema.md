# barn.Schema

用来定义数据库中的一张表，在 indexeddb 中表的字段是无需定义的，只需要定义表的主键、索引等等。

## new barn.Schema(options)

- `keyPath`：主键
- `indexes`：索引列表
  - `name`：索引的名称
  - `keyPath`：索引对应的键
  - `options`：索引属性

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