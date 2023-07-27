const controllers = {
  register: "registration",
  forgotPassword: "forgotPassword",
  resetPassword: "resetPassword",
  login: "login",
  keepLogin: "keepLogin",
  changeUserName: "changeUsername",
  changePassword: "changePassword",
  changeEmail: "changeEmail",
  changePhone: "changePhone",
  changeProfilePicture: "changeProfilePicture",
}

const AuthController = {}

for (const [key, value] of Object.entries(controllers)) {
  AuthController[key] = async (req, res) => {
    try {
      const controllerFunction = require(`./${value}`)
      await controllerFunction(req, res);
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  }
}

module.exports = AuthController
