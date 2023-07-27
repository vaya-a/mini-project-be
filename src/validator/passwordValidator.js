const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*\d])(?=.*\d)(?=.*[.]).{6,}$/
    return passwordRegex.test(password)
  }
  
  const isPasswordEmpty = (password) => {
    return !password
  }
  
module.exports = { isPasswordValid, isPasswordEmpty }
  