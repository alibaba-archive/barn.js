## Model.batch(batches)

`batches` 包含了一系列对数据库的操作。

```javascript
var batches = [
  { opt:'add', value: {...} },
  { opt:'put', value: {...} },
  { opt:'remove', value: {...} }
]
Model.batch(batches).then(function(id) {
  // id is the primary keyPath value of removed item
})
```