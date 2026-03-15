import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Trophy,
  Code,
  Brain,
  Shield,
  Database,
  Globe,
  UserPlus,
  PlayCircle,
  Award,
  Briefcase,
} from "lucide-react";

import api from "../services/api";
import heroImage from "../assets/EdTech-Platform.avif";
import CTC from "../assets/CTC.png";
import Nav from "./homeNav";
import { useTranslation } from "react-i18next";

function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const { t } = useTranslation();

  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    api.get("/courses/popular").then((res) => {
      setPopularCourses(res.data);
    });
  }, []);

  useEffect(() => {
    api.get("/api/courses").then((res) => {
      setCourses(res.data);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50"
    >
      {/* NAVBAR */}

      <Nav />

      {/* HERO SECTION */}

      <section className="py-28 px-10 bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-400 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("hero_title")}
            </h1>

            <p className="italic text-yellow-300 mb-3">
              "विद्या ददाति विनयं, विनयाद् याति पात्रताम्। पात्रत्वात्<br></br>
              धनमाप्नोति, धनात् धर्मं ततः सुखम्॥"
            </p>

            <p className="text-indigo-100 mb-8 max-w-lg">{t("hero_quote")}</p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                {t("start_learning")}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
              >
                {t("browse_courses")}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.img
              src={heroImage}
              className="rounded-2xl shadow-2xl w-full max-w-md"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </div>
      </section>

      {/* RURAL IMPACT */}

      <section className="py-28 px-10 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            {t("bridging")}
          </h2>

          <p className="max-w-3xl mx-auto text-gray-600 text-lg mb-16">
            {t("bridging_desc")}
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {/* CARD 1 */}

            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {t("accessible_learning")}
              </h3>

              <p className="text-gray-600">{t("accessible_learning_desc")}</p>
            </div>

            {/* CARD 2 */}

            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-purple-100">
                <Code className="text-purple-600" />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {t("digital_skills")}
              </h3>

              <p className="text-gray-600">{t("digital_skills_desc")}</p>
            </div>

            {/* CARD 3 */}

            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100">
                <Users className="text-green-600" />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {t("empowering_youth")}
              </h3>

              <p className="text-gray-600">{t("empowering_youth_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="py-28 px-10 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            {t("gyano_works")}
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
            {t("gyano_works_desc")}
          </p>

          <div className="grid md:grid-cols-4 gap-10">
            {/* STEP 1 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100">
                <UserPlus className="text-blue-600" size={28} />
              </div>

              <span className="text-sm text-blue-600 font-semibold">
                Step 1
              </span>

              <h3 className="text-lg font-semibold mt-2 mb-3">
                {t("create_acc")}
              </h3>

              <p className="text-gray-500 text-sm">{t("create_acc_desc")}</p>
            </div>

            {/* STEP 2 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100">
                <PlayCircle className="text-indigo-600" size={28} />
              </div>

              <span className="text-sm text-indigo-600 font-semibold">
                Step 2
              </span>

              <h3 className="text-lg font-semibold mt-2 mb-3">
                {t("start_learning")}
              </h3>

              <p className="text-gray-500 text-sm">
                {t("start_learning_desc")}
              </p>
            </div>

            {/* STEP 3 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-purple-100">
                <Award className="text-purple-600" size={28} />
              </div>

              <span className="text-sm text-purple-600 font-semibold">
                Step 3
              </span>

              <h3 className="text-lg font-semibold mt-2 mb-3">
                {t("build_skills")}
              </h3>

              <p className="text-gray-500 text-sm">{t("build_skills_desc")}</p>
            </div>

            {/* STEP 4 */}

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100">
                <Briefcase className="text-green-600" size={28} />
              </div>

              <span className="text-sm text-green-600 font-semibold">
                Step 4
              </span>

              <h3 className="text-lg font-semibold mt-2 mb-3">
                {t("career_opp")}
              </h3>

              <p className="text-gray-500 text-sm">{t("career_opp_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="py-24 px-10 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t("impact")}
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            {t("impact_desc")}
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {/* STUDENTS */}

            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100">
                <Users className="text-blue-600" size={30} />
              </div>

              <h3 className="text-4xl font-bold text-gray-800 mb-2">1,000+</h3>

              <p className="text-gray-500 font-medium">{t("students")}</p>
            </div>

            {/* LESSONS */}

            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100">
                <BookOpen className="text-indigo-600" size={30} />
              </div>

              <h3 className="text-4xl font-bold text-gray-800 mb-2">100+</h3>

              <p className="text-gray-500 font-medium">{t("lessons")}</p>
            </div>

            {/* COURSES */}

            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-purple-100">
                <Trophy className="text-purple-600" size={30} />
              </div>

              <h3 className="text-4xl font-bold text-gray-800 mb-2">20+</h3>

              <p className="text-gray-500 font-medium">{t("courses")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="py-28 px-10 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t("categories")}
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            {t("category_desc")}
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Code, title: "Web Development", color: "blue" },
              {
                icon: Brain,
                title: "Artificial Intelligence",
                color: "purple",
              },
              { icon: Database, title: "Data Science", color: "indigo" },
              { icon: Shield, title: "Cyber Security", color: "green" },
              { icon: Globe, title: "Cloud Computing", color: "cyan" },
              { icon: BookOpen, title: "Programming", color: "orange" },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                >
                  {/* ICON */}

                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100">
                    <Icon size={30} className="text-blue-600" />
                  </div>

                  {/* TITLE */}

                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COURSES */}

      <section className="px-10 py-28 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            {t("popular_courses")}
          </h2>

          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
            {t("popular_courses_desc")}
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {courses
              .sort((a: any, b: any) => (b.students || 0) - (a.students || 0))
              .slice(0, 3)
              .map((course: any) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
                >
                  {/* COURSE IMAGE */}

                  <div className="overflow-hidden">
                    <img
                      src={course.thumbnail}
                      className="h-48 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  {/* COURSE CONTENT */}

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {course.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-5 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate("/login")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
                      >
                        Enroll
                      </button>

                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS STORIES */}

      <section className="py-28 px-10 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t("success_stories")}
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            {t("sucess_stories_desc")}
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Aman",
                story:
                  "Gyano helped me learn programming and build my first website.",
              },
              {
                name: "Priya",
                story:
                  "I improved my digital skills and now help others learn technology.",
              },
              {
                name: "Rahul",
                story: "This platform opened new career opportunities for me.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
              >
                {/* STORY */}

                <p className="text-gray-600 italic mb-6">"{s.story}"</p>

                {/* USER */}

                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    {s.name.charAt(0)}
                  </div>

                  <h4 className="font-semibold text-gray-800">{s.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}

      <section className="relative bg-white py-28 overflow-hidden">
        {/* Soft background decoration */}

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              {t("CTA")}
            </h2>

            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              {t("CTA_desc")}
            </p>

            {/* QUOTE */}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
              <p className="italic text-gray-600">{t("CTA_desc2")}</p>
            </div>

            {/* BUTTONS */}

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                {t("CTA_btn")}
              </button>

              <button
                onClick={() => navigate("/courses")}
                className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                {t("CTA_btn2")}
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}

          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-2xl">
              <motion.img
                src={CTC}
                className="rounded-xl max-w-lg"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p className="text-lg font-semibold text-white mb-2">Gyano</p>

        <p>Empowering Rural Education in Nabha</p>
      </footer>
    </motion.div>
  );
}

export default Home;
