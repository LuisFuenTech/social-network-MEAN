//Using promises on mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mongoosePaginate = require('mongoose-pagination')
const moment = require('moment')

const Message = require('../models/message')
const User = require('../models/user')
const Follow = require('../models/follow')

const testing = (req, res) => {
    res.status(200).send({Message: 'Hey, how are you?'})
}

const saveMessage = (req, res) => {
    const params = req.body

    if(!params.text || !params.receiver)
        return res.status(200).send({message: "send all needed data"})
   
    const message = new Message()
    message.emitter = req.user.sub
    message.receiver = params.receiver
    message.text = params.text
    message.createAt = moment().unix()
    message.seen = 'false'

    message
        .save()
        .then((messageStoraged) => {
            if(!messageStoraged)
                return res.status(500).send({ message: 'Error on sending message' })

            console.log('Message sent')
            return res.status(200).send({ message: messageStoraged })
        })
        .catch((err) => {
            console.log('Error:', err)
            return res.status(500).send({ message: 'Error on query' })
        })

}

const getReceivedMessages = (req, res) => {
    const userId = req.user.sub
    let page = 1,
        itemsPerPage = 4

    if(req.params.page)
        page = req.params.page
    
    Message
        .find({receiver: userId})
        .populate('emitter', '_id name surname nick image')
        .paginate(page, itemsPerPage, (err, messages, total) => {
            if(err)
            return res.status(500).send({message: "Error on query"})

            if(!messages)
                return res.status(404).send({message: "There aren\´t messages to show"})
        
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                messages
            })
        })
}

const getEmittedMessages = (req, res) => {
    const userId = req.user.sub
    let page = 1,
        itemsPerPage = 4

    if(req.params.page)
        page = req.params.page
    
    Message
        .find({emitter: userId})
        .populate('emitter receiver', '_id name surname nick image')
        .paginate(page, itemsPerPage, (err, messages, total) => {
            if(err)
            return res.status(500).send({message: "Error on query"})

            if(!messages)
                return res.status(404).send({message: "There aren\´t messages to show"})
        
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                messages
            })
        })
}

const getUnseenMessages = (req, res) => {
    const userId = req.user.sub

    Message
        .countDocuments({receiver: userId, seen: 'false'})
        .then((count) => {
            return res.status(200).send({
                Unseen: count
            })
        })
        .catch((err) => {
            console.log('Error:', err)
            return res.status(500).send({ message: 'Error on query' })
        })
}

const setSeenMessages = (req, res) => {
    const userId = req.user.sub

    Message
        .update({receiver: userId, seen: "false"}, {seen: "true"}, {"multi":true})
        .then((messageUpdated) => {
            
            return res.status(202).send({message: messageUpdated})
        })
        .catch((err) => {
            console.log('Error:', err)
            return res.status(500).send({ message: 'Error on query' })
        })
}

module.exports = {
    testing,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnseenMessages,
    setSeenMessages
}