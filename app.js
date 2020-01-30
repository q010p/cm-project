const express = require('express');
//const cors = require('cors')
const app = express();
let path = require('path');



const bodyParser = require('body-parser')
app.use(bodyParser.json())
//app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));


 const indexRouter = require('./routes/index')
// const gisRouter = require('./routes/gis')
// const formsRouter = require('./routes/forms')

 app.use('/', indexRouter)
// app.use('/api/gis', gisRouter)
// app.use('/api/forms',formsRouter)

// require('./data/polygon-manager')


module.exports = app;