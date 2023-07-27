const { CategoryController } = require("../controllers")

const router = require("express").Router()

router.get("", CategoryController.getCategory)

module.exports = router