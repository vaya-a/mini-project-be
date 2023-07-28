const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User
const transporter = require("../../helpers/transporter")

const { isEmailEmpty, isEmailValid } = require("../../validator/emailValidator")


const reqChangeEmail = async (req, res) => {
  try {
    const { email, userName } = req.user
    const { newEmail } = req.body
    
    if (isEmailEmpty(newEmail)) return res.status(400).json({ message: "Email cannot be empty" })
    if (!isEmailValid) return res.status(400).json({ message: "Invalid email format" })
    
    const isEmailExist = await user.findOne({ where: { email: newEmail } })
    if (isEmailExist) return res.status(500).json({ message: "Email used. Try another email" })
    
    await db.sequelize.transaction(async (t) => {
      const token = jwt.sign({ newEmail: newEmail, email: email }, process.env.JWT_KEY, { expiresIn: '1h' })
      await transporter.sendMail({
        from: "Profile Info Mailer <profile@mailer.com>",
        to: newEmail,
        subject: "Request to Change Email",
        text: `Hi, ${userName}! You just requested to change your email, please click this link to process: localhost:8003/api/auth/email/${token}.`,
      })
    })
    return res.status(200).json({ message: "Your request has been sent. Please check your email to verify your request." })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = reqChangeEmail