const isUserNameValid = (userName) => {
  const usernameRegex = /^[a-zA-Z0-9._]+$/ 
  return usernameRegex.test(userName);
};

const isUserNameEmpty = (userName) => {
  return !userName
};

module.exports = { isUserNameValid, isUserNameEmpty }