const router = require("express").Router();
const { userdata } = require("../controllers/index");
const { upload } = require("../helpers/uploader");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/allUser", verifyToken, userdata.getAllUser);
router.get("/allWarehouseAdmin", verifyToken, userdata.getAllWarehouseAdmin);
router.post(
  "/addNewAdmin",
  verifyToken,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "profil",
  }).single("profile_picture"),
  userdata.addNewAdmin
);
router.patch(
  "/editAdmin/:id",
  verifyToken,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "profil",
  }).single("profile_picture"),
  userdata.updateAdmin
);
router.delete("/deleteAdmin/:id", verifyToken, userdata.deleteAdmin);
router.get("/findAllWarehouse", verifyToken, userdata.findAllWarehouse);

module.exports = router;
