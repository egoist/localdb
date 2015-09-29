# LocalDB

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Better localStorage

参考示例见[测试文件](https://github.com/aprilorange/localdb/blob/master/test%2Ftests.js)

## API

### new localdb(name:String, type = 'Array', timestamp = false)
### new localdb(opts:Object)

创建一个新的数据库，可选类型为 `Array`,`Object`，并赋值给变量 `db`

### db.add(obj:Object)

当类型为 `Array` 时可用，在数据库中增加一条集合

### db.get(where)

`where` 为 `null` 时,返回数据库中的内容，返回类型为 `null` 或 `Object` 或 `Array`

`where` 的类型为 `string` 或者 `number` 时返回对应的 `Object[key]` 或者 `Array[index]`

### db.findOne(query:Object)

查询并返回符合条件的一个集合

### db.find(query:Object, opts:Object)

查询并返回数个集合

```javascript
var opts = { limit: 0, sortBy: 'index', sort: 1, skip: 0 }
```

### db.save(obj:Oject)

当类型为 `Array` 时可用，obj 为 `.findOne` 或 `.find` 返回的结果，类型为 `Object`，你可以作出更改之后用 `.update` 更新到数据库

### db.set(key:String, value)

当类型为 `Object` 时可用，更新此数据库的一个键值对，没有则新建

### db.remove(key:String, value)

当类型为 `Array` 按键值对删除对应的集合  
当类型为 `Object` 时直接删除该 key

### db.destroy()

销毁数据库

## License

MIT.
