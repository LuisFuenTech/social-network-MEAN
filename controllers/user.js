//Using promises on mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const User = require('../models/user')
const bcrypt = require('bcrypt-nodejs')
const serviceJwt = require('../services/jwt')
const mongoosePaginate = require('mongoose-pagination')
const fs = require('fs')
const path = require('path')

//Declaring bindings en give them a function as value, (req, res) => {}

const home = (req, res) => {
    res.status(200).send({
        message: "Hello wordl from Node JS"
    })
}

const test = (req, res) => {
    res.status(200).send({
        message: "Testing server on node js"
    })
}

const saveUser = (req, res) => {
    //Getting data from browser
    const { name, surname, nick, email, password } = req.body;
    //Declare a new User
    const user = new User()

    //Prove if it gave me all data
    if (name && surname &&
        nick && email && password) {

        //The new user will set with new data
        //userProperty = dataBrowser
        user.name = name;
        user.surname = surname;
        user.nick = nick;
        user.email = email;
        user.role = 'ROLE_USER'
        user.image = null

        //Control users duplicated
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        })
            .then((users) => {

                if (users.length >= 1) {
                    return res.status(200).send({ message: "User already exits" })
                }

                //Save data
                bcrypt.hash(password, null, null, (err, hash) => {
                    user.password = hash

                    user.save()
                        .then((userStoraged) => {
                            res.status(200).send({ user: userStoraged })
                        })
                })
            })
            .catch((err) => {
                return res.status(500).send({ message: 'Error on query' })
            })
    }
    else {
        res.status(200).send({
            message: 'Full all fields needed!'
        })
    }
}

const loginUSer = (req, res) => {
    //Catch data that browser send
    const params = req.body

    //Get email and password
    const { email } = params
    const { password } = params

    //Execute find in thedatabase by email
    //findOne returns an err or the query (user)
    User.findOne({ email })
        .then((user) => {

            //If user exists...
            if (user) {
                //Compare the password on db and the given by browser
                bcrypt.compare(password, user.password, (err, check) => {
                    //If they match
                    if (check) {

                        //Return user
                        console.log('Login successful')

                        if (params.gettoken) {
                            res.status(200).send({
                                token: serviceJwt.createToken(user)
                            })
                        } else {
                            user.password = undefined //Dont send the password
                            return res.status(200).send({ user })
                        }
                    }
                    else {
                        console.log('Passwords dont match')
                        return res.status(404).send({ message: "Wrong password" })
                    }
                })
            }
            else {
                console.log('User dont exists')
                return res.status(404).send({ message: "User doesnt exist" })
            }
        })
        .catch((err) => {
            return res.status(500).send({ message: 'Error on query' })
        })
}

//Get user's information
const getUser = (req, res) => {
    /*  
        Data from url are given by 'params'
        Data from POST and GET are given by 'body'
    */
    const userId = req.params.id

    User.findById(userId)
        .then((user) => {

            if (!user) return res.status(404).send({ message: "User doesn\'t exist" })

            return res.status(200).send({ user })
        })
        .catch((err) => {
            return res.status(500).send({ message: 'Error on query' })
        })
}

//Get user list paginated
const getUsers = (req, res) => {
    const idUserLogged = req.user.sub
    let page = 1

    //If we get a number page from url
    if (req.params.page) {
        page = req.params.page
    }

    //Count of elements to be shown
    let itemsPerPage = 5

    //Find and sort the documents
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: "Error on request" })

        if (!users) return res.status(404).send({ message: "Users unavailable" })

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        })
    })        
}

//Updating user's information
const updateUser = (req, res) => {
    const userId = req.params.id //By url
    const toUpdate = req.body

    delete update.password

    if (userId != req.user.sub) {
        return res.status(500).send({ message: "You don\'t allow to update user\'s information" })
    }

    User.findByIdAndUpdate(userId, toUpdate, { new: true }, (err, userUpdated) => {
        if (err) return res.status(500).send({ message: "Error on request" })

        if (!userUpdated) return res.status(404).send({ message: "User cannot be update" })

        return res.status(200).send({ user: userUpdated })
    })
}

//Upload user's avatar
const uploadImage = (req, res) => {
    const userId = req.params.id

    if (req.files) {
        const file_path = req.files.image.path
        console.log(file_path)
        const file_split = file_path.split('\\')
        const file_name = file_split[2]
        const ext_split = file_name.split('\.')
        const extentionFile = ext_split[1]
        console.log(extentionFile)

        if (userId != req.user.sub)
            return removeFilesOfUpload(res, file_path, "You don\'t allow to update user\'s information")

        if (extentionFile == 'png' || extentionFile == 'jpg' || extentionFile == 'jpeg' || extentionFile == 'gif') {
            //Update the document
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true })
            .then((userUpdated) => {

                if (!userUpdated) return res.status(404).send({ message: "User cannot be update" })

                return res.status(200).send({ user: userUpdated })
            })
            .catch((err) => {
                return res.status(500).send({ message: 'Error on query' })
            })
        }
        else
            return removeFilesOfUpload(res, file_path, "Invalid extension")

    }
    else
        return res.status(200).send({ message: "File hasn\'t been uploaded" })
}

function getImageFile(req, res) {
    const image_file = req.params.imageFile;
    const path_file = "./uploads/users" + image_file
    console.log(path_file)

    fs.exists(path_file, (exists) => {
        if (exists) {
            console.log('Image ok')
            res.sendFile(path.resolve(path_file))
        }
        else
            console.log('Error image')
        res.status(200).send({ message: "Image does not exist" })
    })
}

function removeFilesOfUpload(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    })
}

module.exports = {
    home,
    test,
    saveUser,
    loginUSer,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}