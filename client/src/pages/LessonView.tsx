import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { CheckCircle } from "lucide-react";

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

  /* LOAD LESSON */

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get(`/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
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

      // youtube.com/watch?v=
      if (parsedUrl.hostname.includes("youtube.com")) {
        const videoId = parsedUrl.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // youtu.be/
      if (parsedUrl.hostname.includes("youtu.be")) {
        const videoId = parsedUrl.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch {
      console.log("Invalid video URL");
    }

    return url;
  };

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
      .catch(() => {
        setQuestions([]);
      });
  }, [lesson]);

  /* MARK LESSON COMPLETE */

  const markLessonComplete = async () => {
    const token = localStorage.getItem("token");

    await api.post(
      "/api/progress/complete",
      {
        lesson_id: lesson.id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setPopup(true);

    setTimeout(() => {
      setPopup(false);
    }, 3000);

    loadProgress();
  };

  /* LOAD PROGRESS */

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

  /* QUIZ ANSWERS */

  const handleAnswer = (id: number, opt: string) => {
    setAnswers({ ...answers, [id]: opt });
  };

  /* SUBMIT QUIZ */

  const submitQuiz = async () => {
    let correct = 0;

    questions.forEach((q: any) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);

    setScore(correct);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    await api.post("/api/quizzes/submit", {
      user_id: user.id,
      lesson_id: Number(lesson.id),
      score: percentage,
    });

    console.log("Submitting quiz:", {
      user_id: user.id,
      lesson_id: lesson.id,
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

  /* FIND LESSON INDEX */

  let currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  let nextLesson = currentIndex !== -1 ? lessons[currentIndex + 1] : null;
  let prevLesson = currentIndex !== -1 ? lessons[currentIndex - 1] : null;

  return (
    <DashboardLayout>
      {/* SUCCESS POPUP */}

      {popup && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={18} />
          Lesson completed successfully
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        {/* MAIN CONTENT */}

        <div className="col-span-3">
          <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

          {/* PROGRESS BAR */}

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Course Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* VIDEO PLAYER */}

          {lesson.video_url && (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
              <iframe
                id="lesson-player"
                width="100%"
                height="450"
                src={`${formatVideo(lesson.video_url)}?enablejsapi=1`}
                title="Lesson Video"
                allowFullScreen
              />
            </div>
          )}

          {/* CONTENT */}

          <div className="bg-white shadow rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>

            <p className="text-gray-600 leading-relaxed">{lesson.content}</p>
          </div>

          {/* COMPLETE BUTTON */}

          <button
            onClick={markLessonComplete}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition mb-8"
          >
            Mark as Completed
          </button>

          {/* QUIZ */}

          {questions.length > 0 && (
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6">Quiz</h2>

              {questions.map((q: any, index: number) => (
                <div key={q.id} className="mb-6">
                  <p className="font-medium mb-3">
                    {index + 1}. {q.question}
                  </p>

                  {[q.option1, q.option2, q.option3, q.option4].map(
                    (opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 mb-2 bg-gray-50 p-2 rounded hover:bg-gray-100 cursor-pointer"
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
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

          <div className="flex justify-between mt-10">
            {prevLesson && (
              <Link
                to={`/lesson/${prevLesson.id}`}
                className="bg-gray-800 text-white px-5 py-2 rounded-lg"
              >
                ← Previous
              </Link>
            )}

            {nextLesson && (
              <Link
                to={`/lesson/${nextLesson.id}`}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Next →
              </Link>
            )}
          </div>
        </div>

        {/* SIDEBAR */}

        <div className="bg-white shadow rounded-xl p-4 h-fit">
          <h3 className="font-semibold mb-4">Course Content</h3>

          {lessons.map((l) => (
            <Link
              key={l.id}
              to={`/lesson/${l.id}`}
              className={`block p-2 rounded mb-2 text-sm ${
                l.id === lesson.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {l.title}
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default LessonView;
