const router = require("express").Router();
const { stockMutation } = require("../controllers/index");

router.get("/getAllStockMutation", stockMutation.getMutStock);
router.get("/warehouse", stockMutation.warehouseData);
router.get("/product", stockMutation.productData);
router.post("/addMutation", stockMutation.addNewMutData);
router.post("/approveMutation/:id", stockMutation.approveMut);
router.post("/denyMutation/:id", stockMutation.denyMut);

module.exports = router;
