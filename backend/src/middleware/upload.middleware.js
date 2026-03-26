const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
 
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Folder based on upload type (team, events, partners)
    const folder = req.query.folder || "beerantum";
    return {
      folder: `beerantum/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    };
  },
});
 
// Only allow images, max 5MB
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
 
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
 
module.exports = upload;