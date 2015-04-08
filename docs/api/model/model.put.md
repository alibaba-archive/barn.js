## Model.put(item)

更新数据，`item` 中必须包含 `primaryKeyValue`，如果没有，或者找不到对应的条目就略过更新。

```javascript
Event.put({
  id: 13,
  startDate: new Date()
}).then(function(event) {
  // event
})
```