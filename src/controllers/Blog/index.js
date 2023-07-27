const controllers = {
    getCategory: "getCategory",
    getCountry: "getCountry",
    createBlog: "createBlog",
    getBlogs: "getBlogs",
    getBlogById: "getBlogById",
    deleteBlog: "deleteBlog"
}

const BlogController = {}

for (const [key, value] of Object.entries(controllers)) {
    BlogController[key] = async (req, res) => {
        try {
            const controllerFunction = require(`./${value}`)
            await controllerFunction(req, res)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = BlogController;
  