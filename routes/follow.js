const express = require('express')
const followController = require('../controllers/follow')
const api = express.Router()
const mdAuth = require('../middlewares/authenticate')

api.post('/follow', mdAuth.ensureAuth, followController.saveFollow)
api.delete('/follow/:id', mdAuth.ensureAuth, followController.deleteFollow)
api.get('/following/:id?/:page?', mdAuth.ensureAuth, followController.getFollowingUSers)
api.get('/followed/:id?/:page?', mdAuth.ensureAuth, followController.getFollowedUsers)

module.exports = api