const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ///^[0-9]+$/
    return emailRegex.test(email)
  }
  
  const isEmailEmpty = (email) => {
    return !email
  }
  
module.exports = {isEmailValid, isEmailEmpty}