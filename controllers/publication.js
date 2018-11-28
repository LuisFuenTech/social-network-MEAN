const path = require('path')
const fs = require('fs')
const moment = require('moment')
const mongoosePagination = require('mongoose-pagination')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const Publication = require('../models/publication')
const User = require('../models/user')
const Follow = require('../models/follow')

const testing = (req, res) => {
    res.status(200).send({message: "Hello from publication controller"})
}

const savePublication = (req, res) => {
    const params = req.body
    const publication = new Publication()

    if(!params.text){
        return res.status(200).send({message: "You must to send a text"})
    }

    publication.text = params.text
    publication.file = 'null'
    publication.user = req.user.sub
    publication.createAt = moment().unix()

    publication.save()
        .then((pubStoraged) => {
            if(!pubStoraged) return releaseEvents.status(400).send({message: "Saving publication failed"})

            return res.status(200).send({publication: pubStoraged})
        })
        .catch((err) => {
            return res.status(500).send({error: err})
        })

}

const getPublication = (req, res) => {
    var page = 1

    if(req.params.page)
        page = req.params.page
    
    var itemsPerPage = 4

    Follow.find({user: req.user.sub})
        .populate('followed')
        .then((follows) => {
            console.log('Inside then')
            var follows_clean = []

            follows.forEach((follow) => {                
                follows_clean.push(follow.followed)
            })
            console.log(follows_clean)

            Publication.find({user: {$in: follows_clean}})
                        .sort('-createAt')
                        .populate('user')
                        .paginate(page, itemsPerPage, (err, publications, total) => {
                            
                            if (err) 
                                return res.status(500).send({ message: "Error on publications" })
                            
                            if(!publications)
                                return res.status(404).send({message: "There is no publication"})
                            
                            return res.status(200).send({
                                totalItems: total,
                                pages: Math.ceil(total/itemsPerPage),
                                page: page,
                                publications
                            })
                        })
            })
            .catch((err) => {
                return res.status(500).send({error: "Error finding users"})
            })
}

module.exports = {
    testing, 
    savePublication,
    getPublication
}