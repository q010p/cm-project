const express = require('express')
const router  = express.Router();
const debug = require('debug')(`${process.env.name}:index-router`)




router.get('/',function(req,res){
    debug(`get request to / endpoint with below params :\n${JSON.stringify(req.query)}`)
    res.send('Welcome to CM')
})


module.exports = router;