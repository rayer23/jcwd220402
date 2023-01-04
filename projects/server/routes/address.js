const router = require('express').Router();
const axios = require('axios');
require('dotenv/config');
const { address } = require('../controllers/index');
const { verifyToken } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.get('/userAddress', verifyToken, address.getAddressById);
router.post(
  '/addNewAddress',
  verifyToken,
  body('recipients_name', 'minimum 3').isLength({ min: 3 }).isString(),
  body('phone_number', 'minimum 9').isLength({ min: 9, max: 14 }).isNumeric(),
  body('address_labels', 'minimum 4').isLength({ min: 4 }).isAlphanumeric(),
  body('province', 'province cannot be empty').isNumeric().notEmpty(),
  body('city', 'city cannot be empty').isNumeric().notEmpty(),
  body('districts', 'districts cannot be empty').isString().notEmpty(),
  body('full_address', 'minimum 7').isLength({ min: 7 }),
  address.addNewAddress,
);

router.patch(
  '/updateAddress/:id',
  verifyToken,
  body('recipients_name', 'minimum 3').isLength({ min: 3 }).isString(),
  body('phone_number', 'minimum 9').isLength({ min: 9, max: 14 }).isNumeric(),
  body('address_labels', 'minimum 4').isLength({ min: 4 }).isAlphanumeric(),
  body('province', 'province cannot be empty').isNumeric().notEmpty(),
  body('city', 'city cannot be empty').isNumeric().notEmpty(),
  body('districts', 'districts cannot be empty').isString().notEmpty(),
  body('full_address', 'minimum 7').isLength({ min: 7 }),
  address.updateAddress,
);
router.delete('/deleteAddress/:id', verifyToken, address.deleteAddress);
router.patch('/setDefault/:id', verifyToken, address.setAsDefault);

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = process.env.BASE_URL_RAJAONGKIR;
axios.defaults.headers.common['key'] = process.env.RAJA_KEY;
axios.defaults.headers.post['Content-Type'] = process.env.AXIOS_HEADERS;
//   Provinsi
router.get('/province', (req, res) => {
  axios
    .get('/province')
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

router.get('/city/:provinceId', (req, res) => {
  const id = req.params.provinceId;
  axios
    .get(`/city?province=${id}`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

module.exports = router;
