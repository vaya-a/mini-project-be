const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User
const usedToken = db.UsedToken

const VerificationController = {
  verify: async (req, res) => {

    try {
      await db.sequelize.transaction(async (t) => {
        const { token } = req.params
        console.log(token)
        let decodedToken = jwt.verify(token, process.env.JWT_KEY)
        const isUser = await user.findOne({attribute: decodedToken.email})
        if (!isUser) {
          return res.status(404).json({ message: `User not found.` })
        }
        
        const isTokenUsed = await usedToken.findOne({ where: { token: token } })
        if (isTokenUsed) return res.status(400).json({ message: "Link already used." })
        
        await user.update({ isVerified: true }, { where: { email: decodedToken.email } })
        await usedToken.create({ token }), {transaction: t}

      return res.status(200).json({ message: "Email successfully verified." })
      })

    } catch (err) { console.error("Error verifying email:", err)
      return res.status(500).json({ message: "Error verifying email." }) }
  }
}

module.exports = VerificationController;