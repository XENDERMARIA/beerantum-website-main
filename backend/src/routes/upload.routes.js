const router = require("express").Router();
const upload = require("../middleware/upload.middleware");
const { uploadImage, deleteImage } = require("../controllers/upload.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
 
// POST /api/upload?folder=team  (or events, partners)
router.post(
  "/",
  protect,
  restrictTo("admin", "editor"),
  upload.single("image"),
  uploadImage
);
 
// DELETE /api/upload/:publicId
router.delete(
  "/:publicId",
  protect,
  restrictTo("admin"),
  deleteImage
);
 
module.exports = router;