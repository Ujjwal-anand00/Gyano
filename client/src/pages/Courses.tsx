import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Courses</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <div
            key={course.id}
            className="border rounded-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <img src={course.thumbnail} className="w-full h-40 object-cover" />

            <div className="p-4">
              <h3 className="font-semibold">{course.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Courses;
