const router = require('express').Router();
const { register, auth } = require('../controllers/index');

const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  validateRegisterEmail,
  validateRegisterPassword,
} = require('../middlewares/validatorMiddleware');

router.post(
  '/registerEmail',
  validateRegisterEmail,
  register.sendEmailRegister,
);
router.post(
  '/registerPassword',
  validateRegisterPassword,
  register.makePassword,
);
router.post(
  '/loginSocialMedia',
  validateRegisterEmail,
  register.loginWithSocialMedia,
);

router.post('/request-reset-password', auth.requestResetPassword);
router.patch(
  '/confirm-reset-password',
  body('newPassword', 'Password not strong enough').isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
  }),
  auth.inputNewPassword,
);

router.post('/login', auth.loginUser);
router.get('/refresh-token', verifyToken, auth.refreshToken);
router.post('/loginSocialMedia', auth.loginWithSocialMedia);
module.exports = router;
