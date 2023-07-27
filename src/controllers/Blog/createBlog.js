const db = require("../../models")
const blog = db.Blog
const user = db.User

const createBlogTransaction = async (user_id, data, img_url) => {
    const { title, keywords, content, category_id, country_id, video_url } = data
    const isVerifiedUser = await user.findOne({ where: { user_id } })
    
    if (!user_id) return { error: "Please login to create a blog" }
    if (!isVerifiedUser?.isVerified) return { error: "Account is not verified, please verify your account to create a blog" }
    
    const errors = []
  
    if (!title) errors.push("Title cannot be empty")
    if (!keywords) errors.push("Keywords cannot be empty")
    if (!content) errors.push("Content cannot be empty")
    if (!category_id) errors.push("Category cannot be empty")
    if (!country_id) errors.push("Country cannot be empty")
  
    if (errors.length > 0) return { error: errors.join(" & ") }
    if (content.length > 500) return { error: "Content's characters must not exceed 500" }
  
    return await db.sequelize.transaction(async (t) => blog.create({ user_id, title, content, category_id, country_id, video_url, keywords, img_url }, { transaction: t }))
}

const createBlog = async (req, res) => {
    try {
        const user_id = req.user.user_id
        const { data } = req.body
        const img_url = req.file.path
        if (req.fileValidationError) {
            return res.status(400).json({
                message: "File validation error",
                error: req.fileValidationError,
            })
        }
        const result = await createBlogTransaction(user_id, JSON.parse(data), img_url)
        
        if (result.error) return res.status(404).json({ message: result.error })
        return res.status(200).json({ message: "Blog successfully posted!", data: result })
    
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
}

module.exports = createBlog
