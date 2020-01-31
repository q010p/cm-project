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
app.use('/api', indexRouter)

let formsRouter = require('./routes/forms')
app.use('/api', formsRouter)

let polygonsRouter = require('./routes/polygons')
app.use('/api', polygonsRouter)


module.exports = app;