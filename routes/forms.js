const express = require('express')
const router  = express.Router();
const debug = require('debug')(`${process.env.name}:forms`)

const db = require('../data/db')


router.get('/form',function(req,res){
    debug(`get request to / endpoint with below params :\n${JSON.stringify(req.query)}`)
    res.send('Welcome to CM')
})


router.put('/forms',function(req,res){
    debug(`put request to /forms endpoint with below params :\n${JSON.stringify(req.body)}`)
    db.get().collection('forms').insertOne(req.body,function(err,dbRes){
        if(err) res.send('something went wrong')
        else res.send('form submitted successfully')
    })
})

router.post('/form/answer',function(req,res){
    debug(`get request to / endpoint with below params :\n${JSON.stringify(req.query)}`)
    res.send('Welcome to CM')
})

router.delete('/form',function(req,res){
    debug(`get request to / endpoint with below params :\n${JSON.stringify(req.query)}`)
    res.send('Welcome to CM')
})

module.exports = router;