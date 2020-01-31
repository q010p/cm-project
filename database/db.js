var MongoClient = require('mongodb').MongoClient
const debug = require('debug')(`${process.env.name}:db`)


var state = {
    db: null,
}


exports.connect = function (url, done) {
    if (state.db) return done()

    MongoClient.connect(url, function (err, db) {
        if (err) return done(err)
        state.db = db.db(process.env['db-nam'])
        debug('connected to database ')

        state.db.createCollection("forms", function (err, res) {
            if (err) throw err
            debug("Collection forms is now on db!")
        });
        state.db.createCollection("users", function (err, res) {
            if (err) throw err
            debug("Collection users is now on db!")
        });
        state.db.createCollection("polygons",function(err,res){
            if(err) throw err;
            debug("Collection polygons is now on db")
        })
        done()
    })
}

exports.get = function () {
    return state.db
}

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}