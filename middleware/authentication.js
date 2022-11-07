const jwt = require('jsonwebtoken')

exports.VerifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        // console.log(token);
        const TokenVerified = jwt.verify(token, process.env.SECRET)
        // console.log(TokenVerified);
        if (TokenVerified) {
            req.user = TokenVerified
            next()
        }
    } catch (error) {
        console.log(error);
    }
}