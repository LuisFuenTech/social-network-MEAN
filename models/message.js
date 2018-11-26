const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    text: String,
    createAt: String,
    emmiter: {type: Schema.ObjectId, ref: 'User'},
    receiver: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Message', messageSchema)