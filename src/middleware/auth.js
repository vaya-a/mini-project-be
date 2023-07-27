const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization
    if(!token){
        return res.status(401).json({message: "Access denied!"})
    }

    try {
        token = token.split(" ")[1]
        if(token === 'null' || !token){
            return res.status(401).json({message: "Access denied!"})
        }
        let verifiedUser = jwt.verify(token, process.env.JWT_KEY)
        if(!verifiedUser){
            return res.status(401).json({message: "Unauthorized request"})
        }
        req.user = verifiedUser
        next()
    }
    catch(err){
        return res.status(400).json({message: "Invalid token", err: err.message})
    }
}

module.exports = verifyToken