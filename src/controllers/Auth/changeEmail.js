const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User
const transporter = require("../../helpers/transporter")

const { isEmailEmpty, isEmailValid } = require("../../validator/emailValidator")


const changeEmail = async (req, res) => {
    try {
        const { user_id, email, userName } = req.user
        const { newEmail } = req.body

        if (isEmailEmpty(newEmail)) return res.status(400).json({ message: "Email cannot be empty" })
        if (!isEmailValid) return res.status(400).json({ message: "Invalid email format" })

        const isEmailExist = await user.findOne({ where: { email: newEmail } })
        if (isEmailExist) return res.status(500).json({ message: "Email used. Try another email" })

        await db.sequelize.transaction(async (t) => {
          await user.update({ email: newEmail }, { where: { user_id }, transaction: t });
          await transporter.sendMail({
            from: "Profile Info Mailer <profile@mailer.com>",
            to: newEmail,
            subject: "Email Changed",
            text: `Hi, ${userName}! This is a confirmation that your previous email ${email} has just been changed to this email.`,
          })
        })
        return res.status(200).json({ message: "Email has successfully changed" })
      } catch (err) {
        return res.status(500).json({ message: err.message })
      }
}

module.exports = changeEmail