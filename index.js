const mongoose = require('mongoose')
const app = require('./app')

//Database connection
mongoose.connect('mongodb://localhost/social_mean', {
    useNewUrlParser: true
})
    .then(() => {
        console.log('Connected to datababe')

        //Create server
        app.listen(app.get('port'), () => {
            console.log(`Server's working on port ${app.get('port')}`)
        })
    })
    .catch((err) => {
    console.log(`Can't connect to database: ${err}`)   
    })

