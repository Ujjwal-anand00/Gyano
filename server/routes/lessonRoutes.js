const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")
const upload = require("../middleware/videoUpload")

const lessonController = require("../controllers/lessonController")


/* GET ALL LESSONS */
router.get(
 "/",
 authMiddleware,
 lessonController.getLessons
)


/* GET ENROLLED LESSONS FOR STUDENT */
router.get(
 "/enrolled",
 authMiddleware,
 lessonController.getEnrolledLessons
)


/* CREATE LESSON (teacher only) */
router.post(
 "/",
 authMiddleware,
 roleMiddleware("teacher"),
 lessonController.createLesson
)


/* GET LESSONS BY COURSE */
router.get(
 "/course/:courseId",
 lessonController.getLessonsByCourse
)


/* GET SINGLE LESSON (with enrollment check) */
router.get(
 "/:id",
 authMiddleware,
 lessonController.getLessonById
)


/* UPDATE LESSON (teacher only) */
router.put(
 "/:id",
 authMiddleware,
 roleMiddleware("teacher"),
 lessonController.updateLesson
)


/* DELETE LESSON (teacher only) */
router.delete(
 "/:id",
 authMiddleware,
 roleMiddleware("teacher"),
 lessonController.deleteLesson
)


/* UPLOAD VIDEO (teacher only) */

router.post(
 "/upload",
 authMiddleware,
 roleMiddleware("teacher"),
 upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
 ]),
 lessonController.uploadLessonVideo
)


module.exports = router