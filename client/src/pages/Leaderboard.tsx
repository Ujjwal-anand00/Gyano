import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

function Leaderboard() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/leaderboard").then((res) => {
      setStudents(res.data);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">

        {/* HEADING */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Student Leaderboard
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">

          {/* 🟢 DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b text-left text-sm text-gray-600">
                  <th className="py-3">Rank</th>
                  <th>Student</th>
                  <th>Completed</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">

                    <td className="py-3 font-semibold">
                      #{index + 1}
                    </td>

                    <td className="font-medium">
                      {student.name}
                    </td>

                    <td>
                      {student.completedLessons}
                    </td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-gray-200 rounded h-3">
                          <div
                            className="bg-blue-600 h-3 rounded"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>

                        <span className="text-sm">
                          {student.progress}%
                        </span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔵 MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4">
            {students.map((student, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-lg">
                    {student.name}
                  </h2>

                  <span className="text-sm font-bold text-blue-600">
                    #{index + 1}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  Completed: {student.completedLessons}
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-full bg-gray-200 rounded h-3">
                    <div
                      className="bg-blue-600 h-3 rounded"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>

                  <span className="text-sm">
                    {student.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default Leaderboard;