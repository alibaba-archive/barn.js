# Database

对应 indexeddb 里面的一个数据库。

## barn.database(options)

创建数据库

> **注意：** 这里的数据库创建只是一种记录，只有通过 `open()` 方法真正打开数据库是才会创建对应的数据库。

```javascript
import * as barn from 'barn'

// barn.database(name, version)
var today = barn.database('today', 1)
```