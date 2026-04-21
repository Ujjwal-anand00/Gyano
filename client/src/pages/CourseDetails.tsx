import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/api/courses/${id}`).then((res) => {
      setCourse(res.data);
    });

    api.get(`/api/lessons/course/${id}`).then((res) => {
      console.log("LESSONS:", res.data);
      setLessons(res.data);
    });
  }, [id]);

  if (!course) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}

      <div className="bg-blue-600 text-white py-16 px-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

          <p className="text-lg mb-6">{course.description}</p>

          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 px-6 py-3 rounded"
          >
            Enroll Now
          </button>
        </div>
      </div>

      {/* COURSE CONTENT */}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>

        <div className="space-y-4">
          {lessons.map((lesson: any, index: number) => (
            <div
              key={lesson.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">
                  Lesson {index + 1}: {lesson.title}
                </h3>

                <p className="text-gray-500 text-sm">{lesson.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
