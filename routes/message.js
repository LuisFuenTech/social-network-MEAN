const express = require('express')
const api = express.Router()
const messageController = require('../controllers/message')
const mdAuth = require('../middlewares/authenticate')

api.get('/testing-md', mdAuth.ensureAuth, messageController.testing)
api.get('/my-messages/:page?', mdAuth.ensureAuth, messageController.getReceivedMessages)
api.get('/messages/:page?', mdAuth.ensureAuth, messageController.getEmittedMessages)
api.get('/unseen-messages/:page?', mdAuth.ensureAuth, messageController.getUnseenMessages)
api.put('/set-seen-messages', mdAuth.ensureAuth, messageController.setSeenMessages)
api.post('/message', mdAuth.ensureAuth, messageController.saveMessage)

module.exports = api