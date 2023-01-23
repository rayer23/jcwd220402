const router = require('express').Router();
const { cart } = require('../controllers/index');

router.post('/', cart.addToCart);
router.get('/me', cart.ShowAllMyCartItems);
router.patch('/addCartItems/:ProductId', cart.addToExistingCart);
router.get('/cartBy/ProductId/:ProductId', cart.findCartByProductId);
router.patch('/increment/:id', cart.incrementCartItems);
router.patch('/decrement/:id', cart.decrementCartItems);
router.delete('/:id', cart.deleteProductFromCart);
router.patch('/cartChecked/:id', cart.checkCartItems);
router.patch('/checkAllCarts', cart.checkAllCartItems);
router.get('/price/total', cart.getTotalPrice);
router.delete('/delete/AllCarts', cart.deleteAllCartItems);
router.patch('/updateCartNote/:id', cart.addCartNote);
router.get('/cartBy/ProductId/:ProductId', cart.findCartByProductId);

module.exports = router;
