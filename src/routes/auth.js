const express = require('express')
const { AuthController } = require('../controllers')
const {register} = require("../controllers/Auth/registration")
const verifyToken = require('../middleware/auth')
const multerUpload = require('../middleware/multer')

const router = express.Router()

router.post("", AuthController.register)
router.put("/password", AuthController.forgotPassword)
router.patch("/password/:token", AuthController.resetPassword)
router.post("/login", AuthController.login)
router.get("", verifyToken, AuthController.keepLogin)
router.patch("/username", verifyToken, AuthController.changeUserName)
router.patch("/password", verifyToken, AuthController.changePassword)
router.patch("/email", verifyToken, AuthController.changeEmail)
router.patch("/phone", verifyToken, AuthController.changePhone)
router.patch("/profile-picture", verifyToken, multerUpload.single("profile-pictures"), AuthController.changeProfilePicture)

module.exports = router;