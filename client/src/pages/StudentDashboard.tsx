import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../components/AnimatedWrapper";
import SearchBar from "../components/SearchBar";

function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<number[]>([]);
  const [progress, setProgress] = useState<any>(null);

  const navigate = useNavigate();

  /* LOAD ALL COURSES */

  const loadCourses = async () => {
    const res = await api.get("/api/courses");

    setCourses(res.data);
  };

  /* LOAD ENROLLED COURSES */

  const loadMyCourses = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/enrollment/my-courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Ensure IDs are numbers
    const enrolledIds = res.data.map((c: any) => Number(c.course_id || c.id));

    setMyCourses(enrolledIds);
  };

  /* LOAD PROGRESS */

  const loadProgress = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/progress/course-progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Progress API:", res.data);

    setProgress(res.data);
  };

  useEffect(() => {
    loadCourses();
    loadMyCourses();
    loadProgress();
  }, []);

  /* ENROLL COURSE */

  const enrollCourse = async (courseId: number) => {
    const token = localStorage.getItem("token");

    await api.post(
      "/api/enrollment/enroll",
      { course_id: courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    loadMyCourses();
  };

  /* SPLIT COURSES */

  const getCourseId = (course: any) => Number(course.course_id || course.id);

  const enrolledCourses = courses.filter((c) =>
    myCourses.includes(getCourseId(c)),
  );

  const exploreCourses = courses.filter(
    (c) => !myCourses.includes(getCourseId(c)),
  );

  return (
    <DashboardLayout>
      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold">Welcome Back 👋</h1>

        <p className="text-gray-500">
          Continue learning and explore new courses.
        </p>
      </div>

      <div className="mb-10">
        <SearchBar />
      </div>

      {/* STATS */}

      {progress && (
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="gyano-glass-card p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle className="text-blue-600" />
            </div>

            <div>
              <p className="text-gray-500 text-sm">Lessons Completed</p>
              <h2 className="text-2xl font-bold">
                {progress.completedLessons}
              </h2>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="gyano-glass-card p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BookOpen className="text-purple-600" />
            </div>

            <div>
              <p className="text-gray-500 text-sm">Total Lessons</p>
              <h2 className="text-2xl font-bold">{progress.totalLessons}</h2>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <TrendingUp />

            <div>
              <p className="text-sm opacity-80">Overall Progress</p>
              <h2 className="text-2xl font-bold">{progress.progress}%</h2>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* AI NOTES BUTTON */}

      <div className="mb-10 flex justify-end">
        <button
          onClick={() => navigate("/ai-notes")}
          className="gyano-button bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-lg shadow"
        >
          📄 View AI Notes
        </button>
      </div>

      {/* MY COURSES */}

      {enrolledCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">My Courses</h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {enrolledCourses.map((course: any) => (
              <motion.div
                key={course.id}
                variants={fadeUp}
                className="gyano-card overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  className="h-40 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded mb-3 inline-block">
                    Enrolled
                  </span>

                  <button
                    onClick={() => navigate(`/lessons`)}
                    className="gyano-button w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Continue Learning
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* EXPLORE COURSES */}

      <div>
        <h2 className="text-xl font-semibold mb-6">Explore Courses</h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {exploreCourses.length > 0 ? (
            exploreCourses.map((course: any) => (
              <motion.div
                key={getCourseId(course)}
                variants={fadeUp}
                className="gyano-card overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  className="h-40 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => navigate(`/course/${getCourseId(course)}`)}
                      className="gyano-button w-full rounded-lg border border-blue-200 bg-white py-2 text-blue-600 transition hover:bg-blue-50"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => enrollCourse(getCourseId(course))}
                      className="gyano-button w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Enroll Course
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={fadeUp}
              className="gyano-glass-card p-6 text-gray-500 md:col-span-3"
            >
              No courses available to explore right now.
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
