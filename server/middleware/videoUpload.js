const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ Allowed types
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // ✅ Video upload
    if (allowedVideoTypes.includes(file.mimetype)) {
      return {
        folder: "gyano/videos",
        resource_type: "video",
      };
    }

    // ✅ Image upload
    if (allowedImageTypes.includes(file.mimetype)) {
      return {
        folder: "gyano/thumbnails",
        resource_type: "image",
      };
    }

    // ❌ Reject unknown file types
    throw new Error("Unsupported file type");
  },
});

// ✅ File filter (extra protection)
const fileFilter = (req, file, cb) => {
  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

// ✅ Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

module.exports = upload;