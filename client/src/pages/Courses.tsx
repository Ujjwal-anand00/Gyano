import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../components/AnimatedWrapper";

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Courses</h1>

      <motion.div
        className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {courses.map((course: any) => (
          <motion.div
            key={course.id}
            variants={fadeUp}
            className="gyano-card overflow-hidden cursor-pointer"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <img src={course.thumbnail} className="w-full h-40 object-cover" />

            <div className="p-4">
              <h3 className="font-semibold">{course.title}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
}

export default Courses;
