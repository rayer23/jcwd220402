const router = require('express').Router();
const { userdata } = require('../controllers/index');
const { upload } = require('../helpers/uploader');
const { verifyToken } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.get('/AllUser', verifyToken, userdata.getAllUser);
router.get('/AllWarehouseAdmin', verifyToken, userdata.getAllWarehouseAdmin);

router.post(
  '/addNewAdmin',
  verifyToken,

  body('email').isEmail().notEmpty(),

  body('password', 'Password not strong enough').isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),

  body('phone_number').isLength({ min: 9 }).isNumeric().notEmpty(),

  body(
    'username',
    'Username length has to be min 3, and only contain alphanumeric chars',
  )
    .isLength({ min: 3 })
    .isAlphanumeric()
    .notEmpty(),

  body('WarehouseId').isNumeric().notEmpty(),

  upload({
    acceptedFileTypes: ['jpg', 'jpeg', 'png'],
    filePrefix: 'profil',
  }).single('profile_picture'),
  userdata.addNewAdmin,
);

router.patch(
  '/editAdmin/:id',
  verifyToken,

  body('email').isEmail(),

  body('password', 'Password not strong enough').isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),

  body('phone_number').isLength({ min: 9 }).isNumeric(),

  body(
    'username',
    'Username length has to be min 3, and only contain alphanumeric chars',
  )
    .isLength({ min: 3 })
    .isAlphanumeric(),
  body('WarehouseId').isNumeric(),

  upload({
    acceptedFileTypes: ['jpg', 'jpeg', 'png'],
    filePrefix: 'profil',
  }).single('profile_picture'),
  userdata.updateAdmin,
);
router.delete('/deleteAdmin/:id', verifyToken, userdata.deleteAdmin);
router.get('/findAllWarehouse', verifyToken, userdata.findAllWarehouse);

module.exports = router;
