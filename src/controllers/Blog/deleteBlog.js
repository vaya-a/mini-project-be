const db = require("../../models")
const blog = db.Blog

const deleteBlog = async (req, res) => {
    try {
        await db.sequelize.transaction(async (t) => {
            const { user_id } = req.user
            const { id: blog_id } = req.params
            const { deleteConfirmation } = req.body
            
            const blogToDelete = await blog.findOne({
                where: { blog_id, user_id }
            })
            
            if (!blogToDelete) return res.status(404).json({ error: 'Blog not found.' })
            if (!deleteConfirmation || deleteConfirmation !== true)
            return res.status(400).json({ error: 'Please confirm first to delete blog.' })
            if (blogToDelete.user_id !== user_id)
            return res.status(403).json({ error: 'Unauthorized to delete the blog.' })
            
            await blogToDelete.destroy(), { transaction: t }
            
            res.status(200).json({ message: 'Blog successfully deleted!' })
        })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the blog.' })
    }
}
  
  module.exports = deleteBlog