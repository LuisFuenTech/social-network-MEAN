const express = require('express')
const api = express.Router()
const mdAuth = require('../middlewares/authenticate')
const publicationController = require('../controllers/publication')
const multiParty = require('connect-multiparty')

//Tell to multiParty where save files
const mdUpload = multiParty({uploadDir: './uploads/publications'})

api.get('/test-pub', mdAuth.ensureAuth, publicationController.testing)
api.get('/publications/:page?', mdAuth.ensureAuth, publicationController.getPublications)
api.get('/publication/:id', mdAuth.ensureAuth, publicationController.getOnePublication)
api.get('/get-image-pub/:imageFile', publicationController.getImageFile)
api.post('/upload-image-pub/:id', [mdAuth.ensureAuth, mdUpload], publicationController.uploadImage)
api.post('/publication', mdAuth.ensureAuth, publicationController.savePublication)
api.delete('/publication/:id', mdAuth.ensureAuth, publicationController.deletePublication)

module.exports = api