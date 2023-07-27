const jwt = require("jsonwebtoken")
const db = require("../../models")
const transporter = require("../../helpers/transporter")
const user = db.User

const { isEmailValid, isEmailEmpty} = require("../../validator/emailValidator")

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const isEmailExist = await user.findOne({ where: { email } })
        if(!isEmailExist) return res.status(400).json({message: "Email not registered"})

        if (isEmailEmpty(email)) return res.status(400).json({ message: "Email address is required" })
        if (!isEmailValid(email)) return res.status(400).json({ message: "Invalid email format" })
        await db.sequelize.transaction(async (t) => {
            const token = jwt.sign({ email: email }, process.env.JWT_KEY, { expiresIn: '1h' })
            const result = await transporter.sendMail({
                from: "Profile Info Mailer <profile@mailer.com>",
                to: email,
                subject: "Reset Password",
                text: `Please click the following link to reset your password: localhost:${process.env.PORT}/api/auth/password/${token}`
            }, { transaction: t })
            return res.status(200).json({ message: "Please check your email to reset your password", data: result })
        })
    
    } catch (err) { return res.status(500).json({ message: "Forgot password failed", error: err.message }) }
}

module.exports = forgotPassword