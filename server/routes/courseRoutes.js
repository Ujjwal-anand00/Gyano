const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const courseController = require("../controllers/courseController")


router.post(
 "/",
 authMiddleware,
 roleMiddleware("teacher"),
 courseController.createCourse
)

router.get("/", courseController.getCourses)

router.delete("/:id", courseController.deleteCourse)

router.put("/:id", courseController.updateCourse)
router.get("/:id", courseController.getCourseById)
router.get("/courses/popular", courseController.getPopularCourses)
router.get("/search", courseController.searchCourses)

module.exports = router