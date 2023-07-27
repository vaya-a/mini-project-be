const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../../models")
const transporter = require("../../helpers/transporter")
const user = db.User
const usedToken = db.UsedToken

const { isPasswordValid, isPasswordEmpty } = require('../../validator/passwordValidator')

const verifyTokenAndGetUser = async (token) => {
  const { email } = jwt.verify(token, process.env.JWT_KEY)
  return await user.findAll({ where: { email } })
}

const checkTokenAndResetPassword = async (token, password, email, confirmPassword) => {
  const isTokenUsed = await usedToken.findOne({ where: { token } })
  if (isTokenUsed) return { isTokenValid: false, message: "Link already used" }
  if (isPasswordEmpty(password)) return { isTokenValid: false, message: "Password is required" }
  if (!isPasswordValid(password)) return { isTokenValid: false, message: "Password must be at least 6 characters with at least 1 symbol, 1 uppercase letter, and 1 number" }
  if (isPasswordEmpty(confirmPassword)) return { isTokenValid: false, message: "Confirm Password is required" }
  if (!isPasswordValid(confirmPassword)) return { isTokenValid: false, message: `Confirm Password must be at least 6 characters with at least 1 symbol, 1 uppercase letter, and 1 number` }
  
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)
  
  await db.sequelize.transaction(async (t) => {
    await user.update({ password: hashPassword }, { where: { email } })
    await usedToken.create({ token })
    
    await transporter.sendMail({
      from: "Profile Info Mailer <profile@mailer.com>",
      to: email,
      subject: "Password Changed",
      text: "This is a confirmation your password has just been changed."
    }, { transaction: t })
  })
  return { isTokenValid: true, message: "Password successfully changed" }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password, confirmPassword } = req.body
    const isUser = await verifyTokenAndGetUser(token)
    if (!isUser) return res.status(404).json({ message: "User not found" })
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords not match" })
    
    const { isTokenValid, message } = await checkTokenAndResetPassword(token, password, isUser[0].email, confirmPassword)
    if (!isTokenValid) return res.status(400).json({ message })
    
    return res.status(200).json({ message })
  } catch (err) {
    return res.status(500).json({ message: `Failed to reset password: ${err.message}.`})
    }
  }
  
module.exports = resetPassword
