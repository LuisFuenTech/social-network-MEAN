//Using promises on mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mongoosePaginate = require('mongoose-pagination')
const User = require('../models/user')
const Follow = require('../models/follow')

const saveFollow = (req, res) => {
    const params = req.body
    const follow = new Follow()

    follow.user = req.user.sub
    follow.followed = params.followed

    follow.save()
        .then((followStoraged) => {
            if (!followStoraged) 
                return res.status(404).send({ message: "Following hasnt been saved" })

            return res.status(200).send({ follow: followStoraged })
        })
        .catch((err) => {
            return res.status(500).send({ message: "Error during saving following" })
        })
}

const deleteFollow = (req, res) => {
    const userId = req.user.sub
    const followId = req.params.id

    Follow.find({ user: userId, followed: followId })
        .deleteOne(() => {
            console.log('Follow delete')
            return res.status(200).send({ message: "Follow has been deleted" })
        })
        .catch((err) => {
            return res.status(500).send({ message: "Error during deleting following" })
        })
}

//Users who we follow
const getFollowingUSers = (req, res) => {
    let userId = req.user.sub

    if (req.params.id && req.params.page)
        userId = req.params.id

    let page = 1

    if (req.params.page)
        page = req.params.page
    else
        page = req.params.id

    let itemsPerPage = 4

    Follow.find({ user: userId })
        .populate({ path: "followed" })
        .paginate(page, itemsPerPage, (err, follows, total) => {
            if (err) 
                return res.status(500).send({ message: "Error on server" })

            if (!follows) 
                return res.status(404).send({ message: "Dont following someone" })

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows
            })
        })
}

//Users who follow us
const getFollowersUsers = (req, res) => {
    //User identified
    let userId = req.user.sub

    if (req.params.id && req.params.page)
        userId = req.params.id

    let page = 1

    if (req.params.page)
        page = req.params.page
    else
        page = req.params.id

    let itemsPerPage = 4

    Follow.find({ followed: userId })
        .populate('user')
        .paginate(page, itemsPerPage, (err, follows, total) => {
            if (err) 
                return res.status(500).send({ message: "Error on server" })

            if (!follows) 
                return res.status(404).send({ message: "No one follow you" })

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows
            })
        })
} 

const getMyFollows = (req, res) => {
    const userId = req.user.sub  
    const followed = req.params.followed

    /*  Find documents when user logged is the follower
        so, this query going to find all users that I follow
    */
    let findFollow = Follow.find({user: userId})

    /*
    *   Find all documents where user logged is followed by anyone else
        so, this query going to find all users that follow me
    */
    if(followed)
        findFollow = Follow.find({followed: userId})

    findFollow.populate("user followed")
        .then((follows) => {
            if(!follows) 
                return res.status(500).send({message: "You don\'t follow anyone"})

            return res.status(200).send({follows})
        })
        .catch((err) => {
            return res.status(500).send({ message: "Error on server" })
        })
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUSers, 
    getFollowersUsers,
    getMyFollows
}