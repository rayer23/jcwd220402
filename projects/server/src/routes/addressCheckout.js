const router = require("express").Router();
const { addressCheckout } = require("../controllers/index");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/defaultAddress", verifyToken, addressCheckout.getMainAddress);
router.get("/allAddress", verifyToken, addressCheckout.getAllAddress);
router.post("/addNewAddress", verifyToken, addressCheckout.addNewAddress);

module.exports = router;
