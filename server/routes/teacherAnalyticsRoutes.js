const express = require("express")
const router = express.Router()
const controller = require("../controllers/teacherAnalyticsController")

router.get("/",controller.getTeacherAnalytics)

module.exports = router
