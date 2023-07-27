const db = require("../../models")
const transporter = require("../../helpers/transporter")
const user = db.User

const { isUserNameValid, isUserNameEmpty } = require("../../validator/usernameValidator")

const changeUserName = async (req, res) => {
    try {
        const { user_id, userName, email } = req.user
        const { newUserName } = req.body

        const isNameEmpty = isUserNameEmpty(newUserName)
        if (isNameEmpty) return res.status(400).json({ message: "Username cannot be empty" })
        if (!isUserNameValid(newUserName)) return res.status(400).json({ message: "Invalid username format. Only letters, numbers, underscores, and dots are allowed." })

        const isUserNameExist = await user.findOne({ where: { userName: newUserName } })
        if (isUserNameExist) return res.status(500).json({ message: "Username used. Try another username" })

        await db.sequelize.transaction(async (t) => {
          await user.update({ userName: newUserName }, { where: { user_id }, transaction: t });
          await transporter.sendMail({
            from: "Profile Info Mailer <profile@mailer.com>",
            to: email,
            subject: "Username Changed",
            text: `This is a confirmation that the username of your account ${userName} has just been changed to ${newUserName}.`,
          })
        })
        return res.status(200).json({ message: "Username has successfully changed" })
      } catch (err) {
        return res.status(500).json({ message: err.message })
      }
}

module.exports = changeUserName