const router = require("express").Router();
const { cart } = require("../controllers/index");
const { verifyToken } = require('../middlewares/authMiddleware')

router.post("/", verifyToken, cart.addToCart)
router.get("/me", verifyToken, cart.ShowAllMyCartItems)
router.get("/:id", cart.getCartItemById)
router.patch("/addCartItems/:ProductId", cart.addToCart2)
router.get("/cartBy/ProductId/:ProductId", cart.findCartByProductId)
router.post("/increment/:id", cart.incrementCartItems)
router.patch("/decrement/:id", cart.decrementCartItems)
router.delete("/:id", cart.deleteProductFromCart)
router.patch("/cartChecked/:id", cart.checkCartItems)
router.patch("/checkAllCarts", verifyToken, cart.checkAllCartItems)
router.get("/price/total", verifyToken, cart.getTotalPrice)
router.delete("/delete/AllCarts", verifyToken, cart.deleteAllCartItems)
router.patch("/updateCartNote/:id", cart.addCartNote)
router.get("/cartBy/ProductId/:ProductId", cart.findCartByProductId)

module.exports = router