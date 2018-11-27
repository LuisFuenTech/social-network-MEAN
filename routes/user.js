const express = require('express')
const api = express.Router()
const userController = require('../controllers/user')
const mdAuth = require('../middlewares/authenticate')
const multiParty = require('connect-multiparty')
const mdUpload = multiParty({uploadDir: './uploads/users'})

api.get('/home', userController.home)
api.get('/test', userController.test)
api.get('/user/:id', mdAuth.ensureAuth, userController.getUser)
api.get('/users/:page?', mdAuth.ensureAuth, userController.getUsers)
api.get('/get-image-user/:imageFile', userController.getImageFile)
api.post('/register', userController.saveUser)
api.post('/login', userController.loginUSer)
api.post('/upload-image-user/:id', [mdAuth.ensureAuth, mdUpload], userController.uploadImage)
api.put('/update-user/:id', mdAuth.ensureAuth, userController.updateUser)

module.exports = api