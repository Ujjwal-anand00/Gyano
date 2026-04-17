const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const courseController = require("../controllers/courseController");

// ✅ CREATE COURSE
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  courseController.createCourse
);

// ✅ SPECIAL ROUTES FIRST (IMPORTANT)
router.get("/popular", courseController.getPopularCourses);
router.get("/search", courseController.searchCourses);

// ✅ GENERAL ROUTES AFTER
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);

// ✅ PROTECTED ACTIONS
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  courseController.deleteCourse
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  courseController.updateCourse
);

module.exports = router;