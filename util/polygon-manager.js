const debug = require('debug')(`${process.env.name}:polygon-manager`)
const inside = require('point-in-polygon')

const db = require('../database/db')


let polygonManager = {}

polygonManager.addPolygon = function (poly) {
    debug('adding a polygon to polygons')
    return db.get().collection('polygons').insertOne(poly, {})
}

polygonManager.checkPointInPolygon = function (lat, long) {
    debug(`check point in polygon with coordinates (${lat},${long})`)
    db.get().collection('polygons').find({}).toArray()

    return new Promise((resolve, reject) => {
        db.get().collection('polygons').find({}).toArray()
            .then(function (value) {
                let result = { polygons: [] };
                value.forEach(element => {
                    if (inside([long, lat], element.geometry.coordinates[0])) {
                        result.polygons.push(element.properties.name)
                    }

                });
                resolve(result)
            })
            .catch((reason) => {
                reject(reason)
            })
    })



}


module.exports = polygonManager;