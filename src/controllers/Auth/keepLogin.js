const db = require("../../models")
const user = db.User

const keepLogin = async (req, res) => {
  try {
    const user_id = req.user.user_id
    
    const data = await user.findOne({where: {user_id: user_id}})
    
    return res.status(200).json({
      data
    })
  }
  catch (err) {
    return res.status(err.statusCode || 500).json({message: err.message
    })
  }
  }
  
  module.exports = keepLogin;