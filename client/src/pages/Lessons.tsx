import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

function Lessons() {
  const [lessons, setLessons] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/api/lessons/enrolled", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLessons(res.data);
      });
  }, []);

  return (
    <DashboardLayout>
      {/* PAGE HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Lessons
        </h1>

        <p className="text-gray-500 mt-1">
          Explore lessons and continue your learning journey.
        </p>
      </div>

      {/* LESSON GRID */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {lessons.map((lesson) => (

          <div
            key={lesson.id}
            onClick={() => navigate(`/lesson/${lesson.id}`)}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
          >

            {/* IMAGE */}

            <div className="relative overflow-hidden">

              <img
                src={lesson.thumbnail}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />

              {/* overlay */}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">

                <BookOpen
                  className="text-white opacity-0 group-hover:opacity-100 transition"
                  size={40}
                />

              </div>

            </div>

            {/* CONTENT */}

            <div className="p-5">

              <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
                {lesson.title}
              </h3>

              <p className="text-sm text-gray-500">
                {lesson.subject}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY STATE */}

      {lessons.length === 0 && (

        <div className="text-center py-20">

          <BookOpen className="mx-auto text-gray-300 mb-4" size={60} />

          <h3 className="text-lg font-semibold text-gray-600">
            No Lessons Available
          </h3>

          <p className="text-gray-400">
            Lessons will appear here once they are added.
          </p>

        </div>

      )}

    </DashboardLayout>
  );
}

export default Lessons;
