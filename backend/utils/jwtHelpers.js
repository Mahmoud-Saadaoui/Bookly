const jwt = require('jsonwebtoken')
exports.sign = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'HS256'
    })
}

exports.verify = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    } catch (e) {
        return false
    }
}
