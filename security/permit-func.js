const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:permit-func`)

module.exports = function permit(...allowed) {
    return (req, res, next) => {
        debug(`check permissions for request with path :${req.baseUrl+req.url} and method ${req.method}`)
        debug(req.user.permission)
        if (allowed.includes(req.user.permission))
            next()
        else {
            res.sendStatus(401)
        }
    }

}




