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
    res.status(200).send({ message: "Hello from publication controller" })
}

const savePublication = (req, res) => {
    const params = req.body
    const publication = new Publication()

    if (!params.text) {
        return res.status(200).send({ message: "You must to send a text" })
    }

    publication.text = params.text
    publication.file = 'null'
    publication.user = req.user.sub
    publication.createAt = moment().unix()

    publication.save()
        .then((pubStoraged) => {
            if (!pubStoraged) return releaseEvents.status(400).send({ message: "Saving publication failed" })

            return res.status(200).send({ publication: pubStoraged })
        })
        .catch((err) => {
            return res.status(500).send({ error: err })
        })

}

/**
 * This method show all publications from users
 * that I follow. Timeline method
 */
const getPublications = (req, res) => {
    let page = 1

    if (req.params.page)
        page = req.params.page

    var itemsPerPage = 4

    Follow
        .find({ user: req.user.sub })
        .populate('followed')
        .then((follows) => {
            var follows_clean = []

            /**
             * Fill an array with all user that I follow
             */
            follows.forEach((follow) => {
                follows_clean.push(follow.followed)
            })

            /**
             * Search for publications that belong to a user inside
             * follows_clean
             */
            Publication
                .find({ user: { $in: follows_clean } })
                .sort('-createAt')
                .populate('user')
                .paginate(page, itemsPerPage, (err, publications, total) => {

                    if (err)
                        return res.status(500).send({ message: "Error on publications" })

                    if (!publications)
                        return res.status(404).send({ message: "There is no publication" })

                    return res.status(200).send({
                        totalItems: total,
                        pages: Math.ceil(total / itemsPerPage),
                        page: page,
                        publications
                    })
                })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({ error: "Error finding users" })
        })
}

/**
 * Get one publication using its id,
 * don't matter if I dont own the publication
 */
const getOnePublication = (req, res) => {
    const publicationId = req.params.id

    Publication
        .findOne({_id: publicationId})
        .then((publication) => {
            if (!publication)
                return res.status(404).send({ message: "Publication doesn\'t exist" })

            return res.status(200).send({ publication })
        })
        .catch((err) => {
            console.log("Error:", err)
            return res.status(500).send({ message: "Error on getting publication" })
        })
}

const deletePublication = (req, res) => {
    const publicationId = req.params.id

    Publication
        .findOneAndDelete({ user: req.user.sub, _id: publicationId })
        .then((deleted) => {
            if(!deleted)
                return res.status(400).send({message: "Publication doesn\'t exist"})
            
            console.log('Removing publication succeed')
            return res.status(200).send({ deleted: deleted })
        })
        .catch((err) => {
            console.log("Error:", err)
            return res.status(500).send({ message: "Error on removing publication" })
        })
}

//Upload files
const uploadImage = (req, res) => {
    const publicationId = req.params.id

    if (req.files) {
        const file_path = req.files.image.path
        const file_split = file_path.split('\\')
        const file_name = file_split[2]
        const ext_split = file_name.split('\.')
        const extentionFile = ext_split[1]       

        if (extentionFile == 'png' || extentionFile == 'jpg' || extentionFile == 'jpeg' || extentionFile == 'gif') {
            Publication
                .findOne({ user: req.user.sub, _id: publicationId })
                .then((publication) => {

                    if (publication) {
                        Publication
                            .findByIdAndUpdate(publicationId, { file: file_name }, { new: true })
                            .then((publicationUpdated) => {

                                if (!publicationUpdated) 
                                    return res.status(404).send({ message: "Publication cannot be updated" })

                                return res.status(200).send({ publication: publicationUpdated })
                            })
                            .catch((err) => {
                                console.log('Error:', err)
                                return res.status(500).send({ message: 'Error on query' })
                            })
                    }
                    else
                        return removeFilesOfUpload(res, file_path, "You don\'t allow to update this publication")  
                })
                .catch((err) => {
                    console.log("Error:", err)
                    return res.status(500).send({message: "Error updating publication"})
                })

            //Update the publication document

        }
        else
            return removeFilesOfUpload(res, file_path, "Invalid extension")

    }
    else
        return res.status(200).send({ message: "File hasn\'t been uploaded" })
}

function removeFilesOfUpload(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        console.log('Error:', err)
        return res.status(200).send({ message: message })
    })
}

function getImageFile(req, res) {
    const image_file = req.params.imageFile;
    const path_file = "./uploads/publications/" + image_file
    console.log(path_file)

    fs.exists(path_file, (exists) => {
        if (exists) {
            console.log('Image ok')
            res.sendFile(path.resolve(path_file))
        }
        else {
            console.log('Error image')
            res.status(200).send({ message: "Image does not exist" })
        }
    })
}

module.exports = {
    testing,
    savePublication,
    getPublications,
    getOnePublication,
    getImageFile,
    uploadImage,
    deletePublication
}