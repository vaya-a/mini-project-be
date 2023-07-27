const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User
const usedToken = db.UsedToken

const changeEmail = async (req, res) => {
    try {
        await db.sequelize.transaction(async (t) => {
            const { token } = req.params
            let decodedToken = jwt.verify(token, process.env.JWT_KEY)
            const isUser = await user.findOne({attribute: decodedToken.email})
            
            if (!isUser) {
                return res.status(404).json({ message: `User not found.` })
            }
            
            const isTokenUsed = await usedToken.findOne({ where: { token: token } })
            if (isTokenUsed) return res.status(400).json({ message: "Link already used." })
            
            await user.update({ email: decodedToken.newEmail }, { where: { email: decodedToken.email } })
            await usedToken.create({ token }), {transaction: t}
            
            return res.status(200).json({ message: "Email successfully changed." })
        })
    } catch (err) { console.error("Error changing email:", err)
    return res.status(500).json({ message: `Error changing email: ${err.message}` }) }
}

module.exports = changeEmail