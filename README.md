# LocalDB

Better localStorage

## API

### new localdb(name:String, type = 'Array')

创建一个新的数据库，可选类型为 `Array`,`Object`，并赋值给变量 `db`

### db.add(obj:Object)

当类型为 `Array` 时可用，在数据库中增加一条集合

### db.get()

返回数据库中的内容，返回类型为 `null` 或 `Object` 或 `Array`

### db.set(key:String, value)

当类型为 `Object` 时可用，更新此数据库的一个键值对，没有则新建

### db.remove(key:String, value)

当类型为 `Array` 按键值对删除对应的集合  
当类型为 `Object` 时直接删除该 key

### db.destroy()

销毁数据库

## License

MIT.
