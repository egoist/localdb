var booksdb = new localdb('books', 'Array')
var config = new localdb('config', 'Object')

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
    author: 'Kinpika',
    year: 2013
  }).add({
    title: '大大泡泡堂',
    author: 'Kinpika',
    year: 2013
  }).get()
}
