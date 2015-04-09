## Index.only()

```javascript
Event.index('cid').only('531fbf3c111ef406171e7ea0')
  .query()
  // or .remove()
  .then(function (events) {
    // do something with events
  })
```