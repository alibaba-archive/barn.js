## Index.lt()

```javascript
// get or remove count is less than 30
Event.index('count').lt(30)
  .query()
  // or .remove()
  .then(function (events) {
    // do something with events
  })
```