const router = require("express").Router();
const { product } = require("../controllers/index");

router.get("/", product.getAllProduct)
router.get("/category", product.getCategory)

router.get("/:id", product.getProductById)
router.get("/image/:id", product.getImage)
router.get("/category/:id", product.getCategoryId)

module.exports = router
