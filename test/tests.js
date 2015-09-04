var booksdb = new localdb('books', 'Array')
var config = new localdb('config', 'Object')
var User = new localdb({
  name: 'User',
  type: 'Array',
  timestamp: true
})

test('localdb is a function', function () {
  ok(typeof localdb == 'function')
})

test('add a book and return books', function () {
  var books = initBooks()
  ok(books instanceof Array)

})

test('remove a book and return books', function () {
  var books = initBooks()
  var updated = booksdb.remove('title', 'Diao').get()
  ok(updated.length == books.length - 1)
})

test('find a book in books', function () {
  initBooks()
  var book = booksdb.findOne({title: 'Diao', author: 'SOX'})
  ok(book.title === 'Diao' && book.author === 'SOX')
})

test('desending all books by index', function () {
  initBooks()
  var books = booksdb.find(null, {sort: -1})
  ok(books[0].title === '大大泡泡堂')
})

test('update a book', function () {
  initBooks()
  var book = booksdb.findOne({title: 'Diao'})
  book.title = 'Love'
  booksdb.save(book)
  book = booksdb.findOne({title: 'Love'})
  ok(book.title === 'Love')
})

test('remove a key', function () {
  var site = config.set('date', Date.now()).set('owner', 'God').get()
  var existed = (typeof site.owner === 'string') ? true : false
  site = config.remove('owner').get()
  var existing = (typeof site.owner === 'string') ? true : false
  ok(existed && !existing)
})

test('update an Object db', function () {
  var site = config.set('sitename', 'Google').get()
  ok(site.sitename === 'Google')
})

test('add a user with auto timestamp', function () {
  var user = User.add({
    username: 'kevin',
    birth: '1994'
  }).findOne({username: 'kevin'})
  ok(user.createdAt)
})

test('destroy db', function () {
  var db = booksdb.destroy().get()
  ok(db === null)
})

function initBooks () {
  booksdb.destroy()
  return booksdb.add({
    title: 'Gone with wind',
    author: 'Kinpika',
    year: 2013
  }).add({
    title: 'Diao',
    author: 'SOX',
    year: 2013
  }).add({
    title: '大大泡泡堂',
    author: 'SOX',
    year: 2013
  }).get()
}
