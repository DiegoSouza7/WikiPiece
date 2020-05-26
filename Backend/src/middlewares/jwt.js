const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if(!authHeader) return res.status(401).send()

        const parts = authHeader.split(' ')
        
        if(!parts.length === 2) return res.status(401).send()

        const [ scheme, token ] = parts

        if(!/^Bearer$/i.test(scheme)) return res.status(401).send()

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if(err) return res.status(401).send()
            req.userId = decoded.id
            return next()
        })
    } catch (error) {
        return res.status(401).send()
    }
}