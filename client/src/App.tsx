import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Skeleton from "./components/Skeleton";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));

const Lessons = lazy(() => import("./pages/Lessons"));
const LessonView = lazy(() => import("./pages/LessonView"));

const QuizPage = lazy(() => import("./pages/QuizPage"));
const Progress = lazy(() => import("./pages/Progress"));

const CourseManager = lazy(() => import("./pages/CourseManager"));
const LessonManager = lazy(() => import("./pages/LessonManager"));
const QuizManager = lazy(() => import("./pages/QuizManager"));

const CourseDetails = lazy(() => import("./pages/CourseDetails"));

const Analytics = lazy(() => import("./pages/Analytics"));
const TeacherAnalytics = lazy(() => import("./pages/TeacherAnalytics"));

const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AINotes = lazy(() => import("./pages/AINotes"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Skeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />

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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
