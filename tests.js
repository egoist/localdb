var should = chai.should,
    expect = chai.expect

localStorage.setItem('tmp', JSON.stringify({a: 1, b: 'hello'}))

var tmpdb = new localdb('tmp')
tmpdb.get().should.be.an('object')
