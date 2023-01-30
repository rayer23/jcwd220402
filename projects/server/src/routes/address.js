const router = require('express').Router();
const axios = require('axios');
const { address } = require('../controllers/index');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateAddress } = require('../middlewares/validatorMiddleware');

router.get('/userAddress', verifyToken, address.getAddressById);

router.post(
  '/addNewAddress',
  verifyToken,
  validateAddress,
  address.addNewAddress,
);

router.patch(
  '/updateAddress/:id',
  verifyToken,
  validateAddress,
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

// Kota / Kabupaten
router.get('/city/:provinceId', (req, res) => {
  const id = req.params.provinceId;
  axios
    .get(`/city?province=${id}`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

module.exports = router;

