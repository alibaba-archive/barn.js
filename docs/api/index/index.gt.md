## Index.gt()

```javascript
// get or remove count is great than 30
Event.index('count').gt(30)
  .query()
  // or .remove()
  .then(function (events) {
    // do something with events
  })
```