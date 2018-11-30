const mongoose = require('mongoose')
const { Schema } = mongoose

const followSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    followed: {type: Schema.ObjectId, ref: 'User'}
}, {versionKey: false})

module.exports = mongoose.model('Follow', followSchema)