const jwt = require('jwt-simple')
const moment = require('moment')
const secret = 'possible_secret_key_link_is_not_zelda'

exports.createToken = (user) => {

    //Payload generates a token
    const payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret)
}