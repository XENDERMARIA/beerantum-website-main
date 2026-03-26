const cloudinary = require("../config/cloudinary");
 
/**
 * POST /api/upload
 * Authenticated — admin or editor only
 * Returns the Cloudinary URL of the uploaded image
 */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
 
    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: req.file.path,           // Cloudinary secure URL
        publicId: req.file.filename,  // Cloudinary public_id (for deletion)
      },
    });
  } catch (err) {
    next(err);
  }
}
 
/**
 * DELETE /api/upload/:publicId
 * Authenticated — admin only
 * Deletes an image from Cloudinary
 */
async function deleteImage(req, res, next) {
  try {
    const { publicId } = req.params;
    // publicId comes URL-encoded, decode it
    const decoded = decodeURIComponent(publicId);
    await cloudinary.uploader.destroy(decoded);
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    next(err);
  }
}
 
module.exports = { uploadImage, deleteImage };