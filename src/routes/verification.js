const { VerificationController } = require("../controllers")

const router = require("express").Router()

router.get("/:token", VerificationController.verify)

module.exports = router