const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    text: String,
    seen: String,
    createAt: String,
    emitter: {type: Schema.ObjectId, ref: 'User'},
    receiver: {type: Schema.ObjectId, ref: 'User'}
}, {versionKey: false})

module.exports = mongoose.model('Message', messageSchema)