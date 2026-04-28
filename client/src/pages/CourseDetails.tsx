import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  PlayCircle,
} from "lucide-react";
import api from "../services/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get(`/api/courses/${id}`).then((res) => {
      setCourse(res.data);
    });

    api.get(`/api/lessons/course/${id}`).then((res) => {
      console.log("LESSONS:", res.data);
      setLessons(res.data);
    });

    if (token) {
      setCheckingEnrollment(true);

      api
        .get("/api/enrollment/my-courses")
        .then((res) => {
          const enrolled = res.data.some(
            (course: any) => Number(course.course_id || course.id) === Number(id),
          );
          setIsEnrolled(enrolled);
        })
        .catch(() => setIsEnrolled(false))
        .finally(() => setCheckingEnrollment(false));
    } else {
      setIsEnrolled(false);
      setCheckingEnrollment(false);
    }
  }, [id]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      setMessage("");

      const res = await api.post("/api/enrollment/enroll", {
        course_id: Number(id),
      });

      setMessage(res.data.message || "Enrollment successful");
      setIsEnrolled(true);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Unable to enroll right now");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="gyano-page-shell min-h-screen bg-gray-50">
      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-500 px-4 py-10 text-white sm:px-6 lg:px-10 lg:py-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="gyano-button mb-8 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-blue-50 backdrop-blur">
                <BookOpen size={16} />
                Course Details
              </div>

              <h1 className="mb-5 text-4xl font-bold leading-tight sm:text-5xl">
                {course.title}
              </h1>

              <p className="mb-8 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg">
                {course.description}
              </p>

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-bold">{lessons.length}</p>
                  <p className="text-sm text-blue-100">Lessons</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-bold">Self-paced</p>
                  <p className="text-sm text-blue-100">Learning</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-bold">
                    {isEnrolled ? "Active" : "Open"}
                  </p>
                  <p className="text-sm text-blue-100">Enrollment</p>
                </div>
              </div>

              <button
                onClick={handleEnroll}
                disabled={enrolling || checkingEnrollment || isEnrolled}
                className={`gyano-button inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-xl sm:w-auto ${
                  isEnrolled
                    ? "bg-emerald-500 text-white disabled:opacity-100"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                } disabled:cursor-not-allowed`}
              >
                {checkingEnrollment || enrolling ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isEnrolled ? (
                  <CheckCircle size={18} />
                ) : (
                  <PlayCircle size={18} />
                )}
                {checkingEnrollment
                  ? "Checking..."
                  : enrolling
                    ? "Enrolling..."
                    : isEnrolled
                      ? "Already Enrolled"
                      : "Enroll Now"}
              </button>

              {message && <p className="mt-4 text-sm text-blue-50">{message}</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="gyano-glass-card overflow-hidden bg-white/10 p-3"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="aspect-video w-full rounded-xl object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* COURSE CONTENT */}

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-gray-500">
              Follow the lessons in order and keep building momentum.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
            <Clock size={15} />
            {lessons.length} lessons
          </div>
        </div>

        {lessons.length > 0 ? (
          <div className="grid gap-4">
            {lessons.map((lesson: any, index: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="gyano-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Lesson {index + 1}: {lesson.title}
                    </h3>

                    <p className="text-sm text-gray-500">{lesson.subject}</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    isEnrolled ? navigate(`/lesson/${lesson.id}`) : handleEnroll()
                  }
                  className="gyano-button inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <PlayCircle size={16} />
                  {isEnrolled ? "Start Lesson" : "Enroll to Access"}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="gyano-glass-card p-8 text-center text-gray-500">
            No lessons have been added to this course yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;
