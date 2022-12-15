const router = require("express").Router();
const { admin } = require("../controllers/index");

const { upload } = require("../helpers/uploader");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/login", admin.adminLogin);

router.post(
  "/categories",
  verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "cat",
  }).single("category_image"),
  admin.adminCreateCategory
);

router.get("/categories", verifyToken, admin.adminGetAllCategories);

router.patch(
  "/categories/:id",
  verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "cat",
  }).single("category_image"),
  admin.adminUpdateCategory
);

router.delete("/categories/:id", verifyToken, admin.adminDeleteCategory);

module.exports = router;
