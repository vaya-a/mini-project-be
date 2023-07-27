const db = require("../../models")
category = db.Category

const CategoryController = {

    getCategory: async (req, res) => {
        try{
            await db.sequelize.transaction(async (t) => {
                const data = await category.findAll({transaction: t})
                

                return res.status(200).json(
                    data)
            })
        }

        catch(err){
            return res.status(err.statusCode || 500).json({
                message: err.message
            })
        }
    }
}

module.exports = CategoryController