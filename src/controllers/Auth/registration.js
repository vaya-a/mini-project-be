const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User
const transporter = require("../../helpers/transporter")

const { isUserNameValid, isUserNameEmpty } = require("../../validator/usernameValidator")
const { isEmailValid, isEmailEmpty } = require("../../validator/emailValidator")
const { isPhoneEmpty, isPhoneValid } = require("../../validator/phoneValidator")
const { isPasswordValid, isPasswordEmpty } = require("../../validator/passwordValidator")

const validateFields = (userName, phone, email, password, confirmPassword) => {
  
  if (isUserNameEmpty(userName)) return "Username cannot be empty."
  if (!isUserNameValid(userName)) return "Invalid username format. Only letters, numbers, underscores, and dots are allowed."
  if (isEmailEmpty(email)) return "Email cannot be empty."
  if (!isEmailValid(email)) return `Invalid email format.`
  if (isPhoneEmpty(phone)) return "Phone number cannot be empty."
  if (!isPhoneValid(phone)) return `Invalid phone number format. Phone number can only contain numeric characters.`
  if (isPasswordEmpty(password, confirmPassword)) return "Password cannot be empty."
  if (!isPasswordValid(password, confirmPassword)) return "Password must be at least 6 characters with at least 1 symbol, 1 uppercase letter, and 1 number."
  return null
  
}

const sendActivationEmail = async (email, token) => {
  await transporter.sendMail({
    from: "Profile Info Mailer <profile@mailer.com>",
    to: email,
    subject: "Account Activation",
    text: `Please click the following link to verify your email: localhost:${process.env.PORT}/verify/${token}`,
  })
}

const handleRegistration = async (req, res) => {
  try {
    const { userName, phone, email, password, confirmPassword } = req.body

    const isEmailExist = await user.findOne({ where: { email } })
    const isUsernameExist = await user.findOne({ where: { userName } })

    if (isEmailExist) return res.status(500).json({ message: "Email Already Exists" })
    if (isUsernameExist) return res.status(500).json({ message: "Username is Already in Use" })
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords not match" })

    await db.sequelize.transaction(async (t) => {
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)

      const result = await user.create({ userName, email, phone, password: hashPassword })

      const token = jwt.sign({ email: email }, process.env.JWT_KEY, { expiresIn: '1h' })
      await sendActivationEmail(email, token, { transaction: t })

      return res.status(200).json({ message: "Register success", data: result })
    })
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const register = async (req, res) => {
  const { userName, email, password, phone, confirmPassword } = req.body;

  const errorMessage = validateFields(userName, phone, email, password, confirmPassword);

  if (errorMessage) {
    return res.status(422).json({ message: errorMessage });
  }

  await db.sequelize.transaction((t) => handleRegistration(req, res, {transaction: t}));
}

module.exports = register;
