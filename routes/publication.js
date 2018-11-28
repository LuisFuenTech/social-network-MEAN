const express = require('express')
const api = express.Router()
const mdAuth = require('../middlewares/authenticate')
const publicationController = require('../controllers/publication')
const multiParty = require('connect-multiparty')

//Tell to multiParty where save files
const mdUpload = multiParty({uploadDir: './uploads/publications'})

api.get('/test-pub', mdAuth.ensureAuth, publicationController.testing)
api.get('/publications/:page?', mdAuth.ensureAuth, publicationController.getPublication)
api.post('/publication', mdAuth.ensureAuth, publicationController.savePublication)

module.exports = api