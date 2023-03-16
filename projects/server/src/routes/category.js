const router = require("express").Router();
const { category } = require("../controllers/index");

router.get("/", category.showAllCategories)
router.get("/category_detail", category.getCategoryByName)

module.exports = router
