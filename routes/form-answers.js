const express = require('express')
const router = express.Router();
const debug = require('debug')(`${process.env.name}:form-answers-router`)

//security
const permit = require('../security/permit-func')
const roles = require('../security/authority-roles')

const ObjectId = require('mongodb').ObjectID

const polygonManager = require('../util/polygon-manager')



const db = require('../database/db').get()

router.get('/forms-answers', permit(roles.CONTROL_CENTER_AGENT, roles.FIELD_AGENT, roles.VISITOR), function (req, res) {
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
        }, {
            $lookup:
            {
                from: 'forms',
                localField: 'formId',
                foreignField: '_id',
                as: 'form'
            }
        },
        {
            $unwind: {
                path: '$user',
                includeArrayIndex: "0"
            }
        },
        {
            $unwind: {
                path: '$form',
                includeArrayIndex: "0"
            }
        },
        {
            $group:
            {
                _id: '$formId',
                form: { $addToSet: '$form' },
                answers: { $addToSet: { answerId: '$_id', user: '$user', answer: '$answers' } }
            }
        },
        {
            $unwind: {
                path: '$form',
                includeArrayIndex: "0"
            }
        },
        {
            $project:
            {
                'answers.user.password': 0, 'answers.user.permission': 0, 'answers.answer.formId': 0
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

router.get('/forms-answers/:formId', permit(roles.CONTROL_CENTER_AGENT, roles.FIELD_AGENT, roles.VISITOR), function (req, res) {
    debug(`get request to ${req.baseUrl + req.url} endpoint with below params :\n${JSON.stringify(req.query)}`)

    db.collection('form_answers').aggregate([
        { $match: { formId: ObjectId(req.params.formId) } },
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
            $lookup:
            {
                from: 'forms',
                localField: 'formId',
                foreignField: '_id',
                as: 'form'
            }
        },
        {
            $unwind: {
                path: '$user',
                includeArrayIndex: "0"
            }
        },
        {
            $unwind: {
                path: '$form',
                includeArrayIndex: "0"
            }
        },
        {
            $group:
            {
                _id: '$formId',
                form: { $addToSet: '$form' },
                answers: { $addToSet: { answerId: '$_id', user: '$user', answer: '$answers' } }
            }
        },
        {
            $unwind: {
                path: '$form',
                includeArrayIndex: "0"
            }
        },
        {
            $project:
            {
                'answers.user.password': 0, 'answers.user.permission': 0, 'answers.answer.formId': 0,
                'form.fields.options': 0
            }
        }
    ])
        // .map(result => {
        //     result.form.fields.forEach(field => {
        //         if (field.type === 'Location') {
        //             result.answers.forEach(ans => {
        //                 polygonManager.checkPointInPolygon(ans.answer[field.name].lat, ans.answer[field.name].long)
        //                     .then(function (value) {
        //                         ans.answer[field.name].polygons = value;
        //                     })
        //             })

        //         }
        //     });
        //     return result
        // })
        .toArray()
        .then(function (value) {
            res.send(value)
        })
        .catch(function (err) {
            res.status(500).send(err)
        })
})

module.exports = router