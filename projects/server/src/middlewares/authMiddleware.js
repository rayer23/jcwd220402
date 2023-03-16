const { validateToken } = require("../helpers/jwt");
const db = require("../models");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "User unauthorized",
    });
  }

  try {
    token = token.split(" ")[1];

    const verifiedUser = validateToken(token);

    if (!verifiedUser) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    req.user = verifiedUser;

    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  verifyToken,
};
