const router = require("express").Router();
const { adminWarehouse } = require("../controllers/index");

router.get("/", adminWarehouse.getAllWarehouseData)
router.post("/", adminWarehouse.addNewWarehouse)
router.patch("/:id", adminWarehouse.editWarehouseData)
router.delete("/:id", adminWarehouse.deleteWarehouseData)

module.exports = router;
