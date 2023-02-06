const router = require("express").Router();
const { adminCategory } = require("../controllers/index");
const { upload } = require("../helpers/uploader");

router.post(
  "/categories",

  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "cat",
  }).single("category_image"),
  adminCategory.adminCreateCategory
);
router.get("/categories", adminCategory.adminGetAllCategories);
router.patch(
  "/categories/:id",
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "cat",
  }).single("category_image"),
  adminCategory.adminUpdateCategory
);
router.delete("/categories/:id", adminCategory.adminDeleteCategory);

module.exports = router;
