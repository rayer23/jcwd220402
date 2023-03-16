const router = require("express").Router();
const { adminProduct } = require("../controllers/index");
const { upload } = require("../helpers/uploader");

router.get("/", adminProduct.getProduct);
router.get("/category", adminProduct.getCategory);

router.post(
  "/",
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "product",
  }).single("image_url"),
  adminProduct.addProduct
);
router.post(
  "/detail/:id",
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "product",
  }).single("image_url"),
  adminProduct.addImages
);

router.get("/detail/:id", adminProduct.getProductDetail);
router.patch("/detail/:id", adminProduct.patchProductDetail);
router.delete("/detail/:id", adminProduct.deleteProductDetail);
router.get("/detail/images/:id", adminProduct.getPictures);
router.delete("/detail/images/:id", adminProduct.deletePictures);

module.exports = router;
