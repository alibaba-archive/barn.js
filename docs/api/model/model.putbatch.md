## Model.putBatch(items)

将 `items` 中每一条数据都更新（或添加）到 `store` 中，相当于批量的 `Model.put/add` 操作。

```javascript
Model.putBatch(items).then(function(id) {
  // id is the primary keyPath value of removed item
})
```