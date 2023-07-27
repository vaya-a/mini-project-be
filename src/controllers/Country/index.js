const db = require("../../models")
country = db.Country

const CountryController = {

    getCountry: async (req, res) => {
        try{
            await db.sequelize.transaction(async (t) => {
                const data = await country.findAll({transaction: t})
                
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

module.exports = CountryController