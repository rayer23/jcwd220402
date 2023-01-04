const router = require("express").Router();
const { adminOrderHistory } = require("../controllers/index");

router.get("/get", adminOrderHistory.getOrder);
router.get("/get2", adminOrderHistory.getByWarehouseId);

module.exports = router;
