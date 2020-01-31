const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:authorization-mw`)
const roles = require('./authority-roles')
const db = require('../database/db').get()
const ObjectId = require('mongodb').ObjectID


const TOKEN_PREFIX = "token "


router.use(function (req, res, next) {
    debug(`authorizing request with path: ${req.url} and method: ${req.method}`)

    let token = req.header('Authorization')

   // if (token != undefined && token.startsWith(TOKEN_PREFIX)){}
        //token = token.substring(TOKEN_PREFIX.length, token.length - 1)
    if(token==undefined) {
        putPermissionsToReq(req, roles.VISITOR)
        next()
        return
    }
    let tokenObject;
    try{
        tokenObject=ObjectId(token);
    }catch(exception){
        putPermissionsToReq(req, roles.VISITOR)
        next()
        return
    }
    db.collection('users').find({ _id: { $eq: ObjectId(token) } }).toArray()
        .then((value) => {
            debug(value)
            if (value.length == 0) {
                putPermissionsToReq(req, roles.VISITOR)
            } else putPermissionsToReq(req, value[0].permission, value[0]._id.toString())
            next()
        })
        .catch((reason) => {
            debug(reason)
            putPermissionsToReq(req, roles.VISITOR)
            next()
        })
})

function putPermissionsToReq(req, permission, userId = -1) {
    req.user = {
        'permission': permission,
        'userId': userId
    }
}




module.exports = router;