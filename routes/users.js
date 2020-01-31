const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:users`)
const db = require('../database/db').get()
const permit = require('../security/permit-func')
const roles = require('../security/authority-roles')

router.post('/authenticate', permit(roles.VISITOR, roles.ADMIN, roles.FIELD_AGENT, roles.CONTROL_CENTER_AGENT), function (req, res) {
    debug(`post request to ${req.url} with below body: \n${JSON.stringify(req.body)}`)
    db.collection('users').find({ phone: { $eq: req.body.phone } }).toArray()
        .then((value) => {
            debug(value)
            res.send(value)
        })
        .catch((reason) => {
            debug(reason)
            res.send(reason)
        })
})

router.post('/signup', permit(roles.VISITOR, roles.ADMIN, roles.FIELD_AGENT, roles.CONTROL_CENTER_AGENT), function (req, res) {
    debug(`post request to ${req.baseUrl + req.url} with below body :\n${JSON.stringify(req.body)}`)
    let phone = req.body.phone
    let name = req.body.name
    let password = req.body.password

    db.collection('users').find({ phone: { $eq: phone } }).toArray()
        .then((value) => {
            if (value.length != 0)
                res.status(400).send({
                    message: "phone number exists"
                })
            else return db.collection('users').insertOne({
                phone: phone,
                name: name,
                password: password,
                permission: roles.FIELD_AGENT
            })
        })
        .then((value) => {
            res.send({token:value.insertedId.toString()})
        })
        .catch((reason) => {
            debug(reason)
            res.send(reason)
        })
        .catch((reason)=>{
            console.log()
        })
})




module.exports = router;