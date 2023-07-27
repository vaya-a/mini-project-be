const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User

const { isUserNameValid, isUserNameEmpty } = require('../../validator/usernameValidator')
const { isEmailValid, isEmailEmpty } = require('../../validator/emailValidator')
const { isPhoneValid, isPhoneEmpty } = require('../../validator/phoneValidator')
const { isPasswordValid, isPasswordEmpty } = require('../../validator/passwordValidator')

const generateToken = (userData) => {

  const payload = {
    user_id: userData.user_id,
    email: userData.email,
    phone: userData.phone,
    isVerified: userData.isVerified,
    userName: userData.userName,
    profilePicture: userData.profilePicture
  }
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" })
}

const validateIdentifier = (email, phone, username) => {
  if (isEmailEmpty(email) && isPhoneEmpty(phone) && isUserNameEmpty(username))
  return { field: null, value: null, message: "Email, phone, or username is required" }
  
  if (isEmailValid(email)) return { field: "email", value: email }
  if (isPhoneValid(phone)) return { field: "phone", value: phone }
  if (isUserNameValid(username)) return { field: "username", value: username }
  
  return { field: null, value: null, message: "Invalid email or phone or username format" }
}

const login = async (req, res) => {
  try {
    const { email, phone, userName, password, confirmPassword } = req.body
    const { field, value, message } = validateIdentifier(email, phone, userName, confirmPassword)
    if (message) return res.status(400).json({ message })
    
    const checkLogin = await user.findOne({ where: { [field]: value } })
    if (!checkLogin) return res.status(404).json({ message: "Email, phone, or username is incorrect" })
    if (!checkLogin.isVerified) return res.status(404).json({ message: "Account not verified. Please check your email to verify your account" })
    
    if (isPasswordEmpty(password)) return res.status(400).json({ message: "Password is required field" })
    if (isPasswordEmpty(confirmPassword)) return res.status(400).json({ message: "Confirm Password is required field" })
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords not match" })
    
    if (!isPasswordValid(password)) return res.status(400).json({ message: "Invalid password format" })
    if (!(await bcrypt.compare(password, checkLogin.password))) return res.status(404).json({ message: "Password is incorrect" })
    
    return res.status(200).json({ message: "Login success", data: generateToken(checkLogin) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
  
module.exports = login