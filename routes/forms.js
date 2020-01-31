const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:forms`)

const db = require('../data/db')


router.get('/forms', function (req, res) {
    debug(`get request to / endpoint with below params :\n${JSON.stringify(req.query)}`)
    db.get().collection('forms').find({}, { projection: {_id:0,id:1, title: 1, fields: 1 } }).toArray(function (err, result) {
        if (err) {
            debug(JSON.stringify(err))
            res.send(500)
        }
        else res.send(result)
    })
})


router.put('/forms', function (req, res) {
    debug(`put request to /forms endpoint with below params :\n${JSON.stringify(req.body)}`)
    db.get().collection('forms').insertOne(req.body, function (err, dbRes) {
        if (err) res.send('something went wrong')
        else res.send('form submitted successfully')
    })
})

router.post('/forms/answer', function (req, res) {
    debug(`post request to / endpoint with below params :\n${JSON.stringify(req.query)}`)
    res.send('Welcome to CM')
})

router.delete('/forms', function (req, res) {
    debug(`delete request to /api/forms endpoint with below params :\n${JSON.stringify(req.query)}`)
    db.get().collection('forms').deleteOne({})
    res.send('Welcome to CM')
})

module.exports = router;