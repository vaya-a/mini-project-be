const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User;
const transporter = require("../../helpers/transporter")

const { isPasswordValid, isPasswordEmpty } = require('../../validator/passwordValidator')

const validatePassword = (password) => {
  if (isPasswordEmpty(password)) return { error: true, message: "Password cannot be empty." }
  if (!isPasswordValid(password)) return { error: true, message: "Password must be at least 6 characters with at least 1 symbol, 1 uppercase letter, and 1 number." }
  return { error: false, message: "" }
}

const comparePasswords = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword)

const validateAndComparePasswords = async (currentPassword, newPassword, confirmPassword, hashedPassword) => {
  const validations = [
    validatePassword(currentPassword),
    validatePassword(newPassword),
    validatePassword(confirmPassword),
  ]
  
  
  if (validations.some((v) => v.error)) {
    return { isValid: false, isSame: false, errors: { currentPassword: validations[0].message, newPassword: validations[1].message, confirmPassword: validations[2].message } }
  }

  const [isValid, isSame] = await Promise.all([comparePasswords(currentPassword, hashedPassword), comparePasswords(newPassword, hashedPassword)])
  return { isValid, isSame, errors: {} }
}

const updatePasswordAndSendEmail = async (user_id, email, userName, newPassword) => {
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(newPassword, salt)
  await user.update({ password: hashPassword }, { where: { user_id } })

  await transporter.sendMail({
    from: "Profile Info Mailer <profile@mailer.com>",
    to: email,
    subject: "Password Changed",
    text: `This is a confirmation that the password of your account ${userName} has just been changed.`,
  });
}

const changePassword = async (req, res) => {
  try {
    const { user_id, email, userName } = req.user
    const checkLogin = await user.findOne({ where: { user_id } })
    const { currentPassword, newPassword, confirmPassword } = req.body

    const { isValid, isSame, errors } = await validateAndComparePasswords(currentPassword, newPassword, confirmPassword, checkLogin.password)

    if (!isValid) return res.status(404).json({ message: "Incorrect password" })

    if (isSame) return res.status(404).json({ message: "There's no change. You put the same passwords"})

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords not match" })
    }

    await updatePasswordAndSendEmail(user_id, email, userName, newPassword)

    return res.status(200).json({ message: "Password has successfully changed" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
    
  }
}

module.exports = changePassword
