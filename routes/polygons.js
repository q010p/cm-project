const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:polygons-router`)
const polygonManager = require('../util/polygon-manager')

const db = require('../database/db').get()


router.put('/polygons', function (req, res) {
    debug('put request to /api/polygons endpoint')

    polygonManager.addPolygon(req.body)
        .then(function (value) {
            res.sendStatus(200)
        })
        .catch(function (reason) {
            debug(reason)
            res.sendStatus(500)
        })

})

router.get('/polygons/point-in-polygon', function (req, res) {
    debug(`get request to /api/polygons/point-in-polygon endpoint with below params\nquery body: ${JSON.stringify(req.body)}`)
    point = req.body
    db.collection("polygons").find({
        geometry:
        {
            $geoIntersects:
            {
                $geometry: {
                    "type": "Point",
                    "coordinates": [ parseFloat(point.long),parseFloat(point.lat)]
                }
            }
        }
    }).toArray()
    .then(function (value) {
        res.send(value)
    });
})


module.exports = router;