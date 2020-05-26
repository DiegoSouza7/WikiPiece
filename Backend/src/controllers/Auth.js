const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader) return  res.status(401).json('primeiro')

        const parts = authHeader.split(' ')
        
        if(!parts.length === 2) return  res.status(401).json('segundo')

        const [ scheme, token ] = parts

        if(!/^Bearer$/i.test(scheme)) return  res.status(401).json('ter')

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if(err) {
                return  res.status(401).json('quarto')
            }

            return  res.status(200).json(true)
        })
    } catch (error) {
        return  res.status(401).json('false')
    }
}