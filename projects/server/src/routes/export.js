const router = require('express').Router();
const { exports1 } = require('../controllers/index');
require('dotenv').config();

router.get('/stock', exports1.showAllStockData);

module.exports = router;
