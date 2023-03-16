const router = require("express").Router();
const { profile } = require("../controllers/index");
const { upload } = require("../helpers/uploader");


router.get("/", profile.getUser);
router.post("/", profile.addUser);
router.get("/:id", profile.getUserProfileById);
router.delete("/:id", profile.deleteUser);
router.patch(
  "/:id",
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "profil",
  }).single("profile_picture"),
  profile.editUserProfile
);

module.exports = router;