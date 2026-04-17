import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Award } from "lucide-react";

function Progress() {
  const [progress, setProgress] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<any[]>([]);
  const [quizStats, setQuizStats] = useState({
    quizzesTaken: 0,
    avgScore: 0,
  });
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/api/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProgress(res.data.lessons);
        setCourseProgress(res.data.courses);
      });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    api.get(`/api/quizzes/stats/${user.id}`).then((res) => {
      setQuizStats(res.data);
    });

    api.get(`/api/quizzes/attempts/${user.id}`).then((res) => {
      console.log("Quiz Attempts:", res.data); // DEBUG
      setQuizAttempts(res.data);
    });
  }, []);

  const totalLessons = progress.length;

  // const averageScore =
  //   progress.length > 0
  //     ? Math.round(
  //         progress.reduce((sum, p) => sum + (p.score || 0), 0) /
  //           progress.length,
  //       )
  //     : 0;

  const downloadCertificate = async (courseId: number) => {
    const token = localStorage.getItem("token");

    const res = await api.get(`/api/certificate/${courseId}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "certificate.pdf");

    document.body.appendChild(link);

    link.click();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">My Learning Progress</h1>

      {/* STATS CARDS */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500">Lessons Completed</p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {totalLessons}
          </h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500">Average Quiz Score</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {quizStats.avgScore}%
          </h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500">Quizzes Taken</p>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {quizStats.quizzesTaken}
          </h2>
        </div>
      </div>

      {/* COURSE CERTIFICATES */}

      <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-6">Course Certificates</h2>

        {courseProgress.length === 0 && (
          <p className="text-gray-500">
            Complete courses to unlock certificates.
          </p>
        )}

        <div className="space-y-4">
          {courseProgress.map((course: any) => {
            const completed = Number(course.progress) >= 100;

            return (
              <div
                key={course.course_id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <h3 className="font-semibold">{course.title}</h3>

                  <p className="text-sm text-gray-500">
                    Progress: {course.progress}%
                  </p>
                </div>

                {completed ? (
                  <button
                    onClick={() => downloadCertificate(course.course_id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Award size={16} />
                    Download Certificate
                  </button>
                ) : (
                  <span className="text-sm text-gray-400">
                    Complete course to unlock
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SCORE CHART */}

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Quiz Performance</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quizAttempts}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="lesson_id" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="score" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}

export default Progress;
