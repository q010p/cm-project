const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:forms-router`)

//security
const permit = require('../security/permit-func')
const roles = require('../security/authority-roles')

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


router.put('/forms', permit(roles.ADMIN, roles.CONTROL_CENTER_AGENT, roles.FIELD_AGENT), function (req, res) {
    debug(`put request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.body)}`)
    db.collection('forms').insertOne(req.body, function (err, dbRes) {
        if (err) res.send('something went wrong')
        else res.send('form submitted successfully')
    })
})

//permit(roles.FIELD_AGENT), 
router.get('/forms/:formId', function (req, res) {
    debug(`get request to ${req.baseUrl + req.url} ${req.params.formId}`)
    let formObjectId
    try {
        formObjectId = ObjectId(req.params.formId);
    } catch (exception) {
        res.status(400).send({ 'message': 'wrong form id' })
        return
    }
    db.collection('forms').findOne({ _id: { $eq: formObjectId } }, {})
        .then((value) => {
            if (value == null) {
                debug('form doesn\'t exists')
                res.status(400).send('wrong form id')
            }
            else { res.send(value) }
        })
        .catch((reason) => {
            res.status(500).send(reason)
        })

})

router.post('/forms/answer', permit(roles.FIELD_AGENT), function (req, res) {
    debug(`post request to ${req.baseUrl + req.url} endpoint with below body :\n${JSON.stringify(req.body)}`)
    db.collection('form_answers').insertOne({
        userId: ObjectId(req.user.userId),
        formId: req.body.formId,
        answers: req.body
    })
    res.send('Welcome to CM')
})

router.delete('/forms', function (req, res) {
    debug(`delete request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.query)}`)
    //db.collection('forms').deleteOne({})
    res.send('Welcome to CM')
})


router.get('/forms/answers',permit(roles.CONTROL_CENTER_AGENT), function (req, res) {
    debug(`get request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.query)}`)
    db.collection('form_answers').aggregate([
        {
            $lookup:
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user',
                includeArrayIndex: "0"
            }
        },
        {
            $group:
            {
                _id: '$formId',
                //form:{$addToSet:'$form'},
                answers: { $push: { answerId: '$_id', user: '$user', answer: '$answers' } }
            }
        },
        {
            $project:
            {
                'answers.user.password': 0, 'answers.user.permission': 0,'answers.answer.formId':0
            }
        }
    ]).toArray()
        .then(function (value) {
            res.send(value)
        })
        .catch(function (err) {
            res.status(500).send(err)
        })
})

router.get('/forms/answers/user/:userId', function (req, res) {
    debug(`get request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.query)}`)
    db.collection('form_answers').find({ user: { '$id': { $eq: req.params.userId } } }, {}).toArray()
        .then(function (value) {
            res.send(value)
        })
        .catch(function (err) {
            res.sendStatus(err)
        })

})


module.exports = router;