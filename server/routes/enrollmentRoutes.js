const express = require("express")
const router = express.Router()

const enrollmentController = require("../controllers/enrollmentController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/enroll", authMiddleware, enrollmentController.enrollCourse)

router.get("/my-courses", authMiddleware, enrollmentController.getMyCourses)

module.exports = router