const express = require('express')
const followController = require('../controllers/follow')
const api = express.Router()
const mdAuth = require('../middlewares/authenticate')

api.post('/follow', mdAuth.ensureAuth, followController.saveFollow)
api.delete('/follow/:id', mdAuth.ensureAuth, followController.deleteFollow)
api.get('/following/:id?/:page?', mdAuth.ensureAuth, followController.getFollowingUSers)
api.get('/followers/:id?/:page?', mdAuth.ensureAuth, followController.getFollowersUsers)
api.get('/get-my-follows/:followed?', mdAuth.ensureAuth, followController.getMyFollows)

module.exports = api