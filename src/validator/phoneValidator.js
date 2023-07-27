const isPhoneValid = (phone) => {
  const phoneRegex = /^[0-9]+$/
  return phoneRegex.test(phone)
}

const isPhoneEmpty = (phone) => {
  return !phone
}

module.exports = {isPhoneValid, isPhoneEmpty}