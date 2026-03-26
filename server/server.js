const express = require("express")
const cors = require("cors")

require("./database/init")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const lessonRoutes = require("./routes/lessonRoutes")
const quizRoutes = require("./routes/quizRoutes")
const progressRoutes = require("./routes/progressRoutes")
const courseRoutes = require("./routes/courseRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")
const enrollmentRoutes = require("./routes/enrollmentRoutes")
const teacherAnalyticsRoutes = require("./routes/teacherAnalyticsRoutes")
const leaderboardRoutes = require("./routes/leaderboardRoutes")
const certificateRoutes = require("./routes/certificateRoutes")
const aiRoutes = require("./routes/aiRoutes")
const aiNoteRoutes = require("./routes/aiNoteRoutes");

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/lessons", lessonRoutes)
app.use("/api/quizzes", quizRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/enrollment", enrollmentRoutes)
app.use("/api/teacher-analytics",teacherAnalyticsRoutes)
app.use("/api/leaderboard",leaderboardRoutes)
app.use("/api/certificate",certificateRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/ai-notes", aiNoteRoutes)

app.get("/", (req, res) => {
  res.send("Digital Learning Platform API running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})