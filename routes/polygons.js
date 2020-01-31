const express = require('express')
const router  = express.Router();
const debug = require('debug')(`${process.env.name}:polygons-router`)
const polygonManager = require('../util/polygon-manager')


router.put('/polygons', function(req,res){
    debug('put request to /api/polygons endpoint')

    polygonManager.addPolygon(req.body)
    .then(function(value){
        res.sendStatus(200)
    })
    .catch(function(reason){
        debug(reason)
        res.sendStatus(500)
    })
    
})

router.get('/polygons/point-in-polygon',function(req,res){
    debug(`get request to /api/polygons/point-in-polygon endpoint with below params\nquery params: ${JSON.stringify(req.query)}`)
    polygonManager.checkPointInPolygon(req.query.lat,req.query.long)
    .then((value)=>{
        res.send(value)
    })
    .catch((reason)=>{
        debug(reason)
        res.sendStatus(500)
    })
})


module.exports = router;