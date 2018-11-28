const mongoose = require('mongoose')
const { Schema } = mongoose

const publicationSchema = new Schema({
       text: String,
       file: String,
       createAt: String,
       user: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Publication', publicationSchema)