const { BlogController } = require("../controllers")
const verifyToken = require("../middleware/auth")
const multerUpload = require("../middleware/multer")

const router = require("express").Router()

router.get("/category", BlogController.getCategory)
router.get("/country", BlogController.getCountry)
router.post("", verifyToken, multerUpload.single("file"), BlogController.createBlog)
router.get("", BlogController.getBlogs)
router.get("/:id", verifyToken, BlogController.getBlogById)
router.delete("/:id", verifyToken, BlogController.deleteBlog)

module.exports = router