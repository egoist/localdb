# LocalDB

[![NPM version](https://img.shields.io/npm/v/localdb.svg?style=flat-square)](https://www.npmjs.com/package/localdb)
[![NPM download](https://img.shields.io/npm/dm/localdb.svg?style=flat-square)](https://www.npmjs.com/package/localdb)
[![Travis Build](https://img.shields.io/travis/egoist/localdb.svg?style=flat-square)](https://travis-ci.org/egoist/localdb)

## Example

```javascript
import localdb from 'localdb'
const Notes = new localdb('notes', 'Array', true)

// insert some collections and return the collections
let notes = Notes
  .add({title: 'Today is a big day', category: 'diary'})
  .add({title: 'I met my ex today', category: 'diary'})
  .add({title: 'Levandowski is amazing!', category: 'football'})
  .get()

// remove all post categoried in football
Notes.remove('category', 'football')

// find posts and update
const query = {title: 'diary'}
const opts = {limit: 2, sort: 1, sortBy: 'title', skip: 0}
Notes.find(query, opts).forEach(note => {
  note.author = 'egoist'
  Notes.save(note)
})

// override the whole database and generate meta
Notes.override([{title: 'New post'}], true)

// populate another class, eg: your Post have a Author field
const Post = new localdb('Post', 'Array')
const User = new localdb('User', 'Array')

// you should have the Author's objectId to create an instance of that class
const author = User.extend('some_object_id')

Post.add({
  title: 'mt post title',
  author: author
})

// then you can populate that field before .find or .findOne
Post.populate('author').findOne()

// create an Object database and set some property
const Site = new localdb('site', 'Object')
Site.set('sitename', 'Google')

// get sitename
const sitename = Site.get('sitename')

// destroy some database
Site.destroy()
```

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

当类型为 `Array` 时可用，obj 为 `.findOne` 或 `.find` 返回的结果，类型为 `Object`，你可以作出更改之后用 `.save` 更新到数据库

### db.set(key:String, value)

当类型为 `Object` 时可用，更新此数据库的一个键值对，没有则新建

### db.remove(key:String, value)

当类型为 `Array` 按键值对删除对应的集合
当类型为 `Object` 时直接删除该 key

### db.extend(objectId)

创建一个该数据库的 `Pointer` 用于 `populate`

### db.populate(field)

在 `.find` 或 `.findOne` 时获取该 `field` 指向的 `collection`

### db.override(colleciton, reinit = false)

用 `collection` 整个覆盖旧的数据库

`reinit` 为 `true` 将自动按照 `opts` 配置为每个 `Object` 生成 `_id` `createdAt` `updatedAt`

### db.destroy()

销毁数据库

---

相关文章: [一个简单的 localStorage 扩展实现](https://egoist.github.io/2015/09/30/a-light-weight-localstorage-orm/)

## License

This project is released under SOX license that means you can do whatever you want to do, but you have to open source your copy on github if you let the public uses it. All copies should be released under the same license. The owner of each copy is only reponsible for his own copy, not for the parents, not for the children.

permitted use:  
fork on github  
change  
do evil with your copy  

prohibted use:  
do evil with copies not of your own  
open source your copy without declaring your parent copy  
