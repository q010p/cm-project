const express = require('express');
//const cors = require('cors')
const app = express();
let path = require('path');



const bodyParser = require('body-parser')
app.use(bodyParser.json())
//app.use(cors())
//static folder
app.use(express.static(path.join(__dirname, 'public')));

let indexRouter = require('./routes/index')
app.use('/', indexRouter)

let formsRouter = require('./routes/forms')
app.use('/', formsRouter)


module.exports = app;