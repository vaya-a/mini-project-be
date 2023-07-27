const jwt = require("jsonwebtoken")
const db = require("../../models")
const user = db.User
const transporter = require("../../helpers/transporter")

const { isPhoneEmpty, isPhoneValid } = require("../../validator/phoneValidator")

const changePhone = async (req, res) => {
    try {
        const { user_id, email, userName } = req.user
        const { newPhone } = req.body

        if (isPhoneEmpty(newPhone)) return res.status(400).json({ message: "Phone number cannot be empty" })
        if (!isPhoneValid(newPhone)) return res.status(400).json({ message: "Invalid phone number format. Phone number can only contain numeric characters" })

        await db.sequelize.transaction(async (t) => {
          await user.update({ phone: newPhone }, { where: { user_id }, transaction: t });
          await transporter.sendMail({
            from: "Profile Info Mailer <profile@mailer.com>",
            to: email,
            subject: "Phone Number Changed",
            text: `Hi, ${userName}! This is a confirmation that your phone number has just been changed.`,
          })
        })
        return res.status(200).json({ message: "Phone Number has successfully changed" })
      } catch (err) {
        return res.status(500).json({ message: err.message })
      }
}

module.exports = changePhone