## Model.removeBatch(items)

将 `items` 中每一条数据从 store 中删除，相当于批量的 `Model.remove` 操作。

```javascript
Model.removeBatch(items).then(function(id) {
  // id is the primary keyPath value of removed item
})
```