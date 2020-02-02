const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:forms-router`)

const ObjectId = require('mongodb').ObjectID


const db = require('../database/db').get()


router.get('/forms', function (req, res) {
    debug(`get request to ${req.baseUrl + req.url} endpoint`)
    db.collection('forms').find({})
    .toArray(function (err, result) {
        if (err) {
            debug(err)
            res.sendStatus(500)
        }
        else res.send(result)
    })
})


router.put('/forms', function (req, res) {
    debug(`put request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.body)}`)
    db.collection('forms').insertOne(req.body, function (err, dbRes) {
        if (err) res.send('something went wrong')
        else res.send('form submitted successfully')
    })
})

router.get('/forms/:formId', function (req, res) {
    debug(`get request to ${req.baseUrl + req.url} ${req.params.formId}`)
    let formObjectId 
    try{
        formObjectId=ObjectId(req.params.formId);
    }catch(exception){
        res.status(400).send({'message':'wrong form id'})
        return
    }
    db.collection('forms').findOne({ _id: { $eq: formObjectId } }, {})
        .then((value) => {
            debug(value)
            if (value == null) {
                debug('form doesn\'t exists')
                res.status(400).send('wrong form id')
            }
            else {res.send()}
        })
        .catch((reason) => {
            res.status(500).send(reason)
        })

})

router.post('/forms/answer', function (req, res) {
    debug(`post request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.query)}`)
    debug(req.body)
    db.collection('')
    res.send('Welcome to CM')
})

router.delete('/forms', function (req, res) {
    debug(`delete request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.query)}`)
    db.collection('forms').deleteOne({})
    res.send('Welcome to CM')
})


module.exports = router;