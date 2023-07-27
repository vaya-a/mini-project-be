const { CountryController } = require("../controllers")


const router = require("express").Router()

router.get("", CountryController.getCountry)

module.exports = router