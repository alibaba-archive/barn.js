## Model.index(indexName)

获取一个虚拟的 `index`，可以调用 `only` `.between` `.gt` `.lt` 等进行链式操作。

```javascript
Event.index('cid')
  .only('52dcb2ae7b16b8fb088680a0')
  .query()
  .then(function (events) {
    // 获取 cid 为 52dcb2ae7b16b8fb088680a0 的 events
  })
```