const router = require("express").Router();
const { shipment } = require("../controllers/index");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/userAddress", verifyToken, shipment.getAddressById);
router.get("/warehouseAddress", verifyToken, shipment.getWarehouseAddress);
router.post("/query", verifyToken, shipment.query);

module.exports = router;
