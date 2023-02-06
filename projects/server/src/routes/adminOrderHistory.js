const router = require('express').Router();
const { adminOrderHistory } = require('../controllers/index');

router.get('/getOrder', adminOrderHistory.getAllOrderHistory);
router.get('/findWarehouse', adminOrderHistory.findWarehouse);
module.exports = router;
