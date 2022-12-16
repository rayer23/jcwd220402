const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "3d",
  });
};

const validateToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

const decode = (token) => {
  return jwt.decode(token);
};

module.exports = {
  signToken,
  validateToken,
  decode,
};
