const router = require('express').Router();
const { stock } = require('../controllers/index');
const { verifyToken } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.get('/getAllWarehouse', verifyToken, stock.getAllWarehouse);

router.get(
  '/getAllProduct/:id',
  verifyToken,
  stock.getAllStockProductByWarehouse,
);

router.patch(
  '/updateStock/:id',
  verifyToken,
  body('stock').isNumeric(),
  stock.editProductStock,
);

router.patch('/deleteStock/:id', verifyToken, stock.deleteStock);

router.get('/getAllCategory/', verifyToken, stock.getAllCategory);

module.exports = router;
