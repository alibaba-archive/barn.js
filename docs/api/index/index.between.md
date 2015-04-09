## Index.only()

```javascript
// get or remove count is between 30 and 50
Event.index('count').between(30, 50)
  .query()
  // or .remove()
  .then(function (events) {
    // do something with events
  })
```