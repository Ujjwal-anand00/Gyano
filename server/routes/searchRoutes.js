const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const searchController = require("../controllers/searchController");

const router = express.Router();

router.get("/", authMiddleware, searchController.search);

module.exports = router;
