const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const userRoutes = require('./routes/user')
const followRoutes = require('./routes/follow')
const publicationRoutes = require('./routes/publication')
const messageRoutes = require('./routes/message')

//Settings
app.set('port', process.env.PORT || 3000)

//Middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//Routes
app.use('/api', userRoutes)
app.use('/api', followRoutes)
app.use('/api', publicationRoutes)
app.use('/api', messageRoutes)

//Export

module.exports = app;