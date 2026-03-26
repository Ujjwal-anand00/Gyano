import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./pages/StudentDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import Lessons from "./pages/Lessons"
import LessonView from "./pages/LessonView"
import QuizPage from "./pages/QuizPage"
import Progress from "./pages/Progress"
import CourseManager from "./pages/CourseManager"
import LessonManager from "./pages/LessonManager"
import QuizManager from "./pages/QuizManager"
import CourseDetails from "./pages/CourseDetails"
import Analytics from "./pages/Analytics"
import TeacherAnalytics from "./pages/TeacherAnalytics"
import Leaderboard from "./pages/Leaderboard"
import AINotes from "./pages/AINotes"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard/>} />
        <Route path="/teacher/courses" element={<CourseManager />} />
        <Route path="/teacher/lessons" element={<LessonManager />} />
        <Route path="/teacher/quiz" element={<QuizManager />} />

        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lesson/:id" element={<LessonView />} />

        <Route path="/quiz/:lessonId" element={<QuizPage />} />
        <Route path="/progress" element={<Progress />} />

        <Route path="/course/:id" element={<CourseDetails />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/teacher-analytics" element={<TeacherAnalytics />} />

        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route path="/ai-notes" element={<AINotes />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App