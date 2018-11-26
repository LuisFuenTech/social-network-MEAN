const jwt = require('jwt-simple')
const moment = require('moment')
const secret = 'possible_secret_key_link_is_not_zelda'

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({message: "Query dont have the header of authentication"})
    }

    //clean token
    const token = req.headers.authorization.replace(/['"]+/g, '')
    
    try {
        var payload = jwt.decode(token, secret)
        
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: "Token has expired"
            })
        }

    } catch (error) {
        return res.status(404).send({
            message: "Token is no valid"
        })
    }

    //Adding new attribute called 'user' to storage the payload on req
    req.user = payload;

    next();
}