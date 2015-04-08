## Model.add(data)

向 store 中添加一条数据。

```javascript
Event.add({
  startDate: new Date(),
  endDate: new Date(),
  isSync: 'YES'
}).then(function (event) {
  // do something with event
})
```