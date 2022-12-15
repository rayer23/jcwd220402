const router = require("express").Router();
const { register, auth } = require("../controllers/index");

const { body } = require("express-validator");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post(
  "/registerEmail",
  body("email").isEmail(),
  register.sendEmailRegister
);

router.post(
  "/registerPassword",
  body(
    "username",
    "Username length has to be min 3, and only contain alphanumeric chars"
  )
    .isLength({ min: 3 })
    .isAlphanumeric(),
  body("password", "Password not strong enough").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),
  register.makePassword
);
router.post(
  "/loginSocialMedia",
  body("email").isEmail(),
  register.loginWithSocialMedia
);

router.post("/request-reset-password", auth.requestResetPassword);
router.patch(
  "/confirm-reset-password",
  body("newPassword", "Password not strong enough").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),
  auth.inputNewPassword
);

router.post("/login", auth.loginUser);
router.get("/refresh-token", verifyToken, auth.refreshToken);
router.post("/loginSocialMedia", auth.loginWithSocialMedia);
module.exports = router;
