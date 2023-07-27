const db = require("../../models")
country = db.Country

const getCountry= async (req, res) => {
    try{
        await db.sequelize.transaction(async (t) => {
            const data = await country.findAll({
                attributes: ["country_id", "country"]
            }, {transaction: t})
            
            return res.status(200).json(data)
        })
    }
    
    catch(err){
        return res.status(err.statusCode || 500).json({
        message: err.message})
    }
}

module.exports = getCountry