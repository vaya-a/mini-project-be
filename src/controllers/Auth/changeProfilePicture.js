const db = require("../../models")
const user = db.User

const changeProfilePicture = async (req, res) => {
    try {
        const { user_id } = req.user
        
        if (req.fileValidationError) {
            return res.status(400).json({
                message: "File validation error",
                error: req.fileValidationError,
            })
        }
        
        await db.sequelize.transaction(async (t) => {
            await user.update(
                { profilePicture: req.file.path },
                { where: { user_id: user_id } },
                { transaction: t }
            )
            
            return res.status(200).json({
                message: "Your profile picture has successfully changed!",
            })
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        })
    }
}

module.exports = changeProfilePicture