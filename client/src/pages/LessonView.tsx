import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { CheckCircle } from "lucide-react";
import AIAssistant from "../components/AIAssistant";
import { saveVideo, getVideo } from "../services/videoService";
import { motion } from "framer-motion";

function LessonView() {
  const { id } = useParams();

  const [lesson, setLesson] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [score, setScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  /* LOAD LESSON */
  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get(`/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("LESSON DATA:", res.data); // 👈 ADD THIS
        setLesson(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("You must enroll in this course first");
      });
  }, [id]);

  const formatVideo = (url: string) => {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtube.com")) {
        const videoId = parsedUrl.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (parsedUrl.hostname.includes("youtu.be")) {
        const videoId = parsedUrl.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch {
      console.log("Invalid video URL");
    }

    return url;
  };

  // Download video when lesson loads

  useEffect(() => {
    if (!lesson) return;

    const loadVideo = async () => {
      const localVideo = await getVideo(String(lesson.id));

      if (localVideo?.blob) {
        const localUrl = URL.createObjectURL(localVideo.blob);
        setVideoSrc(localUrl);
        setIsDownloaded(true);
      } else {
        setVideoSrc(lesson.video_url);
      }
    };

    loadVideo();
  }, [lesson]);

  /* LOAD COURSE LESSONS */
  useEffect(() => {
    if (!lesson) return;

    const token = localStorage.getItem("token");

    api
      .get(`/api/lessons/course/${lesson.course_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLessons(res.data);
      });
  }, [lesson]);

  /* LOAD QUIZ */
  useEffect(() => {
    if (!lesson) return;

    const token = localStorage.getItem("token");

    api
      .get(`/api/quizzes/lesson/${lesson.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuestions(res.data);
      })
      .catch(() => setQuestions([]));
  }, [lesson]);

  /* PROGRESS */
  const loadProgress = () => {
    const token = localStorage.getItem("token");

    api
      .get(`/api/progress/course/${lesson.course_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProgress(res.data.progress || 0);
      });
  };

  useEffect(() => {
    if (!lesson) return;
    loadProgress();
  }, [lesson]);

  /* COMPLETE LESSON */
  const markLessonComplete = async () => {
    const token = localStorage.getItem("token");

    await api.post(
      "/api/progress/complete",
      { lesson_id: lesson.id },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setPopup(true);
    setTimeout(() => setPopup(false), 3000);

    loadProgress();
  };

  // DOWNLOAD VIDEO
  const handleDownload = async () => {
    try {
      const response = await fetch(lesson.video_url);
      const blob = await response.blob();

      await saveVideo(String(lesson.id), blob);
      setIsDownloaded(true);

      alert("Downloaded for offline 🎉");
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  /* QUIZ */
  const handleAnswer = (id: number, opt: string) => {
    setAnswers({ ...answers, [id]: opt });
  };

  const submitQuiz = async () => {
    let correct = 0;

    questions.forEach((q: any) => {
      if (answers[q.id] === q.answer) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setScore(correct);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    await api.post("/api/quizzes/submit", {
      user_id: user.id,
      lesson_id: Number(lesson.id),
      score: percentage,
    });

    markLessonComplete();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-center mt-10">Loading lesson...</p>
      </DashboardLayout>
    );
  }

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = lessons[currentIndex + 1];
  const prevLesson = lessons[currentIndex - 1];

  return (
    <DashboardLayout>
      {/* SUCCESS POPUP */}
      {popup && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
        >
          <CheckCircle size={18} />
          Lesson completed successfully
        </motion.div>
      )}

      <div className="p-4 sm:p-6">
        <motion.div
          key={lesson.id}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
              {lesson.title}
            </h1>

            {/* PROGRESS */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Course Progress</span>
                <span>{progress}%</span>
              </div>

                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
            </div>

            {/* DOWNLOAD BUTTON */}

                {lesson.video_url && (
                  <button
                    onClick={handleDownload}
                    disabled={isDownloaded}
                    className="gyano-button mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:scale-100 disabled:opacity-70"
                  >
                    {isDownloaded ? "Downloaded ✔️" : "Download for Offline"}
                  </button>
                )}

            {/* VIDEO */}
            {lesson.video_url && (
              <div className="gyano-glass-card overflow-hidden mb-6 lg:sticky lg:top-24 z-20">
                <div className="aspect-video">
                  <video
                    className="w-full h-full"
                    controls
                    src={videoSrc || lesson.video_url}
                  />
                </div>
              </div>
            )}

            {/* CONTENT */}
            <div className="gyano-glass-card p-4 sm:p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3">Lesson Content</h2>
              <p className="text-gray-600">{lesson.content}</p>
            </div>

            {/* AI */}
            <div className="gyano-glass-card p-4 sm:p-6 mb-6">
              <AIAssistant lesson={lesson} />
            </div>

            {/* COMPLETE */}
            <button
              onClick={markLessonComplete}
              className="gyano-button w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg mb-8"
            >
              Mark as Completed
            </button>

            {/* QUIZ */}
            {questions.length > 0 && (
              <div className="gyano-glass-card p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-6">Quiz</h2>

                {questions.map((q: any, index: number) => (
                  <div key={q.id} className="mb-6">
                    <p className="mb-3">
                      {index + 1}. {q.question}
                    </p>

                    {[q.option1, q.option2, q.option3, q.option4].map(
                      (opt, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2 mb-2 p-3 bg-white/70 rounded-lg transition hover:bg-blue-50"
                        >
                          <input
                            type="radio"
                            name={`q${q.id}`}
                            onChange={() => handleAnswer(q.id, opt)}
                          />
                          {opt}
                        </label>
                      ),
                    )}
                  </div>
                ))}

                <button
                  onClick={submitQuiz}
                  className="gyano-button w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Submit Quiz
                </button>

                {score !== null && (
                  <p className="mt-4 font-semibold">
                    Score: {score} / {questions.length}
                  </p>
                )}
              </div>
            )}

            {/* NAVIGATION */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-10">
              {prevLesson && (
                <Link
                  to={`/lesson/${prevLesson.id}`}
                  className="gyano-button w-full sm:w-auto text-center bg-gray-800 text-white px-5 py-2 rounded-lg"
                >
                  ← Previous
                </Link>
              )}

              {nextLesson && (
                <Link
                  to={`/lesson/${nextLesson.id}`}
                  className="gyano-button w-full sm:w-auto text-center bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="gyano-glass-card p-4 h-fit lg:sticky lg:top-24">
            <h3 className="font-semibold mb-4">Course Content</h3>

            {lessons.map((l) => (
              <Link
                key={l.id}
                to={`/lesson/${l.id}`}
                className={`block p-3 rounded-lg mb-2 text-sm transition ${
                  l.id === lesson.id ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {l.title}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default LessonView;
