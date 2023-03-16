const router = require('express').Router();
const { salesReport } = require('../controllers/index');

router.get('/get', salesReport.getReport);
router.get('/findWarehouse', salesReport.findWarehouse);

module.exports = router;
