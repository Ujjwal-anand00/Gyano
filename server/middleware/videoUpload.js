const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("video")) {
      return {
        folder: "gyano/videos",
        resource_type: "video",
      };
    }

    if (file.mimetype.startsWith("image")) {
      return {
        folder: "gyano/thumbnails",
        resource_type: "image",
      };
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
