const db = require("../../models")
const blog = db.Blog
const user = db.User
const category = db.Category
const country = db.Country

const getBlogById = async (req, res) => {
    try{
        await db.sequelize.transaction(async (t) => {
            const blog_id = req.params.id
            const data = await blog.findOne({
                where: {blog_id: blog_id},
                include: [
                    {model: user, attributes: ['userName']},
                    {model: category, attributes: ['category']},
                    {model: country, attributes: ['country']}
                ],
            }, {transaction: t})
            
            return res.status(200).json({data})
        })  
    }
    
    catch(err){
        return res.status(err.statusCode || 500).json({message: err.message})
    }
}

module.exports = getBlogById