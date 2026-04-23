const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/create-teacher",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.createTeacher
);

module.exports = router;
