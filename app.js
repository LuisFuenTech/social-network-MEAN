const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const userRoutes = require('./routes/user')
const followRoutes = require('./routes/follow')
const publicationRoutes = require('./routes/publication')

//Settings
app.set('port', process.env.PORT || 3000)

//Middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Routes
app.use('/api', userRoutes)
app.use('/api', followRoutes)
app.use('/api', publicationRoutes)

//Cors

//Export

module.exports = app;