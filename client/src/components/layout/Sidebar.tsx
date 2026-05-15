import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Layers,
  ClipboardList,
  LogOut,
  UserRound,
  Trophy,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";

function Sidebar({ open, mobileOpen, setMobileOpen }: any) {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();
  const showLabel = open || mobileOpen;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItem = (path: string, label: string, Icon: any) => {
    const active = location.pathname === path;

    return (
      <Link
        to={path}
        onClick={() => setMobileOpen(false)}
        className={`relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-medium transition
        ${
          active
            ? "text-primary"
            : "text-muted-foreground hover:bg-slate-100/80 hover:text-foreground dark:hover:bg-white/8"
        }
        ${showLabel ? "" : "justify-center"}`}
        aria-label={label}
        title={showLabel ? undefined : label}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-2xl bg-primary/10"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <Icon className="relative z-10" size={18} />
        {showLabel && <span className="relative z-10 truncate">{label}</span>}
      </Link>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-screen max-h-screen w-72 flex-col border-r border-border bg-white/82 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl transition-all duration-300 dark:bg-slate-950/82 dark:shadow-black/40
        ${open ? "lg:w-64" : "lg:w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-4 pt-8">
          <div className="flex flex-col gap-2">
          {role === "admin" && (
            <>
              {navItem("/admin", "Admin Panel", ShieldCheck)}
              {navItem("/admin/create-teacher", "Create Teacher", UserPlus)}
            </>
          )}

          {role === "teacher" && (
            <>
              {navItem("/teacher", "Dashboard", LayoutDashboard)}
              {navItem("/teacher/courses", "Manage Courses", Layers)}
              {navItem("/teacher/lessons", "Lessons", BookOpen)}
              {navItem("/teacher/quiz", "Quiz", ClipboardList)}
              {navItem("/teacher-analytics", "Analytics", BarChart3)}
              {navItem("/leaderboard", "Leaderboard", Trophy)}
              {navItem("/profile", "Profile", UserRound)}
            </>
          )}

          {role === "student" && (
            <>
              {navItem("/student", "Dashboard", LayoutDashboard)}
              {navItem("/lessons", "Lessons", BookOpen)}
              {navItem("/progress", "Progress", BarChart3)}
              {navItem("/analytics", "Analytics", BarChart3)}
              {navItem("/leaderboard", "Leaderboard", Trophy)}
              {navItem("/profile", "Profile", UserRound)}
            </>
          )}
          </div>
        </div>

        <div className="mt-auto shrink-0 border-t border-border bg-white/70 p-4 backdrop-blur dark:bg-white/5">
          <button
            onClick={handleLogout}
            className={`gyano-button flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 ${
              showLabel ? "" : "justify-center"
            }`}
            aria-label="Logout"
            title={showLabel ? undefined : "Logout"}
          >
            <LogOut size={18} />
            {showLabel && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
