const express = require('express');
const app = express();
let path = require('path');



const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const cors = require('cors')
app.use(cors())
//static folder
app.use(express.static(path.join(__dirname, 'public')));

let authenticationMW = require('./security/authorization-mw')
app.use(authenticationMW)

let indexRouter = require('./routes/index')
app.use('/api', indexRouter)

let formsRouter = require('./routes/forms')
app.use('/api', formsRouter)

let polygonsRouter = require('./routes/polygons')
app.use('/api', polygonsRouter)

let usersRouter = require('./routes/users')
app.use('/api', usersRouter)


module.exports = app;