const router = require('express').Router();
const { userdata } = require('../controllers/index');
const { upload } = require('../helpers/uploader');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  validateAdmin,
  validateAdminUpdate,
} = require('../middlewares/validatorMiddleware');

router.get('/AllUser', verifyToken, userdata.getAllUser);

router.get('/AllWarehouseAdmin', verifyToken, userdata.getAllWarehouseAdmin);

router.post(
  '/addNewAdmin',
  verifyToken,
  validateAdmin,
  upload({
    acceptedFileTypes: ['jpg', 'jpeg', 'png'],
    filePrefix: 'profil',
  }).single('profile_picture'),
  userdata.addNewAdmin,
);

router.patch(
  '/editAdmin/:id',
  verifyToken,
  validateAdminUpdate,
  upload({
    acceptedFileTypes: ['jpg', 'jpeg', 'png'],
    filePrefix: 'profil',
  }).single('profile_picture'),
  userdata.updateAdmin,
);

router.delete('/deleteAdmin/:id', verifyToken, userdata.deleteAdmin);

router.get('/findAllWarehouse', verifyToken, userdata.findAllWarehouse);

module.exports = router;
