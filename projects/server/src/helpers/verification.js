const jwt = require("jsonwebtoken")

const createVerificationToken = (payload) => {
  return jwt.sign(payload, process.env.VERIF_KEY, { expiresIn: "15m" })
}

const validateVerificationToken = (token) => {
  return jwt.verify(token, process.env.VERIF_KEY)
}

module.exports = {
  createVerificationToken,
  validateVerificationToken,
}
