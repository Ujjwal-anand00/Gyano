import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  Code,
  Database,
  Globe,
  PlayCircle,
  Shield,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";

import api from "../services/api";
import CTC from "../assets/CTC.png";
import Nav from "./HomeNav";
import { useTranslation } from "react-i18next";
import CodeBlock from "../components/CodeBlock";
import AnimatedWrapper, {
  fadeUp,
  staggerContainer,
} from "../components/AnimatedWrapper";
import Footer from "./Footer";

const categories = [
  { icon: Code, title: "Web Development", tone: "from-blue-500 to-cyan-400" },
  { icon: Brain, title: "Artificial Intelligence", tone: "from-fuchsia-500 to-violet-500" },
  { icon: Database, title: "Data Science", tone: "from-indigo-500 to-blue-500" },
  { icon: Shield, title: "Cyber Security", tone: "from-emerald-500 to-teal-400" },
  { icon: Globe, title: "Cloud Computing", tone: "from-sky-500 to-blue-500" },
  { icon: BookOpen, title: "Programming", tone: "from-amber-500 to-rose-400" },
];

const steps = [
  { icon: UserPlus, titleKey: "create_acc", descKey: "create_acc_desc" },
  { icon: PlayCircle, titleKey: "start_learning", descKey: "start_learning_desc" },
  { icon: Award, titleKey: "build_skills", descKey: "build_skills_desc" },
  { icon: Briefcase, titleKey: "career_opp", descKey: "career_opp_desc" },
];

const successStories = [
  {
    name: "Aman",
    achievement: "Frontend Developer",
    story:
      "Got a frontend internship after building React dashboards, portfolio projects, and a clean GitHub profile.",
    Icon: Code,
    accent: "from-sky-500 to-cyan-400",
  },
  {
    name: "Priya",
    achievement: "Career Switch",
    story:
      "Moved from a non-tech background into software development with structured lessons and guided practice.",
    Icon: Sparkles,
    accent: "from-violet-500 to-fuchsia-400",
  },
  {
    name: "Rahul",
    achievement: "Confidence Builder",
    story:
      "Built real-world projects, practiced interviews, and gained the confidence to explain his work clearly.",
    Icon: Trophy,
    accent: "from-amber-500 to-rose-400",
  },
];

const ctaStats = [
  { value: "100+", label: "Students" },
  { value: "20+", label: "Courses" },
  { value: "95%", label: "Success Rate" },
];

const trustSignals = [
  "Project-first learning",
  "Career-ready paths",
  "Community support",
];

function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    let mounted = true;

    api.get("/api/courses").then((res) => {
      if (mounted) setCourses(res.data);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const featuredCourses = useMemo(
    () =>
      [...courses]
        .sort((a: any, b: any) => (b.students || 0) - (a.students || 0))
        .slice(0, 3),
    [courses],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45 }}
      className="gyano-page-shell"
    >
      <Nav />

      <section className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.2),transparent_28rem),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.18),transparent_26rem)]" />
        <div className="gyano-container relative z-10 grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <AnimatedWrapper className="max-w-3xl">
            <h1 className="text-balance text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {t("hero_title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {t("hero_quote")}
            </p>
            <p className="mt-4 max-w-xl rounded-3xl border border-border bg-white/60 p-4 text-sm italic text-muted-foreground backdrop-blur dark:bg-white/6">
              "Vidya dadati vinayam, vinayad yati patratam."
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/register")}
                className="gyano-primary-button"
              >
                {t("start_learning")}
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="gyano-secondary-button"
              >
                {t("browse_courses")}
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-xl">
              {[
                ["1,00+", t("students")],
                ["50+", t("lessons")],
                ["10+", t("courses")],
              ].map(([value, label]) => (
                <div key={String(label)} className="gyano-glass-card p-4">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedWrapper>

          <AnimatedWrapper delay={0.12} className="relative">
            <div className="gyano-glass-card overflow-hidden p-3">
              <CodeBlock />
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      <section className="gyano-section">
        <div className="gyano-container text-center">
          <span className="gyano-kicker">Mission</span>
          <h2 className="gyano-heading">{t("bridging")}</h2>
          <p className="gyano-subtitle">{t("bridging_desc")}</p>
          <motion.div
            className="mt-14 grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
          >
            {[
              [BookOpen, t("accessible_learning"), t("accessible_learning_desc")],
              [Code, t("digital_skills"), t("digital_skills_desc")],
              [Users, t("empowering_youth"), t("empowering_youth_desc")],
            ].map(([Icon, title, desc]: any) => (
              <motion.div key={title} variants={fadeUp} className="gyano-card p-8 text-left">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="gyano-section">
        <div className="gyano-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="gyano-kicker">Learning System</span>
            <h2 className="gyano-heading">{t("gyano_works")}</h2>
            <p className="gyano-subtitle">{t("gyano_works_desc")}</p>
          </div>

          <motion.div
            className="mt-14 grid gap-5 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.titleKey} variants={fadeUp} className="gyano-card p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
                      <Icon size={22} />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{t(step.titleKey)}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="gyano-section">
        <div className="gyano-container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="gyano-kicker">Academy</span>
              <h2 className="gyano-heading">{t("categories")}</h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {t("category_desc")}
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="gyano-secondary-button w-full md:w-auto"
            >
              {t("browse_courses")}
            </button>
          </div>

          <motion.div
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
          >
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} variants={fadeUp} className="gyano-card p-6">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-lg`}>
                    <Icon size={26} />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Structured paths, practical lessons, and measurable progress.
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="gyano-section">
        <div className="gyano-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="gyano-kicker">Popular Courses</span>
            <h2 className="gyano-heading">{t("popular_courses")}</h2>
            <p className="gyano-subtitle">{t("popular_courses_desc")}</p>
          </div>

          <motion.div
            className="mt-14 grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
          >
            {featuredCourses.map((course: any) => (
              <motion.article key={course.id} variants={fadeUp} className="gyano-card overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {course.description}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="gyano-primary-button px-4 py-2.5"
                    >
                      Enroll
                    </button>
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="gyano-secondary-button px-4 py-2.5"
                    >
                      View
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="gyano-section overflow-hidden">
        <div className="gyano-container grid gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <AnimatedWrapper className="max-w-2xl">
            <span className="gyano-kicker">Student Outcomes</span>
            <h2 className="gyano-heading mt-3 max-w-xl tracking-tight">
              {t("success_stories")}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {t("sucess_stories_desc")}
            </p>

            <motion.div
              className="mt-10 space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
            >
              {successStories.map((student) => {
                const Icon = student.Icon;

                return (
                  <motion.article
                    key={student.name}
                    variants={fadeUp}
                    whileHover={{ y: -6, scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="group relative overflow-hidden rounded-[30px] border border-border/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all duration-300 hover:border-primary/25 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:bg-white/[0.045]"
                  >
                    <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${student.accent}`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-primary/5 to-cyan-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />

                    <div className="relative flex gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br ${student.accent} text-white shadow-lg shadow-primary/15`}>
                        <Icon size={25} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold tracking-tight text-foreground">
                            {student.name}
                          </h3>
                          <span className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            {student.achievement}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                          {student.journey}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {student.story}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatedWrapper>

          <AnimatedWrapper
            delay={0.1}
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.28),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(168,85,247,0.24),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#111827_100%)] p-6 text-white shadow-[0_30px_100px_rgba(2,6,23,0.35)] sm:p-8 lg:p-10"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_28%,rgba(255,255,255,0.08)_62%,transparent)] opacity-70" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/70 shadow-inner shadow-white/5 backdrop-blur-xl">
                <Sparkles size={14} />
                Join learners worldwide
              </div>

              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[28px] border border-white/15 bg-white/10 text-white shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl">
                  <CheckCircle2 size={30} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    {t("CTA")}
                  </h3>
                    <p className="mt-4 max-w-xl text-base leading-8 text-white/70">
                    {t("CTA_desc")}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {ctaStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/10 bg-white/[0.08] p-4 shadow-inner shadow-white/5 backdrop-blur-2xl"
                  >
                    <p className="text-2xl font-bold tracking-tight">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-white/60">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {trustSignals.map((signal) => (
                  <div
                    key={signal}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-xl"
                  >
                    <CheckCircle2 size={14} className="text-cyan-300" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-950 shadow-[0_18px_45px_rgba(255,255,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  {t("CTA_btn")}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 rounded-2xl border border-white/[0.18] bg-white/[0.08] px-5 py-4 text-sm font-bold text-white shadow-inner shadow-white/5 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/[0.14] focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {t("CTA_btn2")}
                </button>
              </div>
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      <Footer/>
    </motion.div>
  );
}

export default Home;
