const router = require("express").Router();
const { userProfile } = require("../controllers/index");
const { upload } = require("../helpers/uploader");


router.get("/get/:id", userProfile.getUserProfileById);

router.patch("/info/:id", userProfile.editUserProfile);
router.patch(
  "/pic/:id",
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "profil",
    limits: { fileSize: 210 },
  }).single("profile_picture"),
  userProfile.editPhotoProfile
);
router.patch("/password/:id", userProfile.passwordEdit);

module.exports = router;
