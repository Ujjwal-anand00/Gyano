const express = require("express")
const router = express.Router()
const controller = require("../controllers/certificateController")
const auth = require("../middleware/authMiddleware")

router.get("/:courseId",auth,controller.generateCertificate)

module.exports = router
