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
        className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium overflow-hidden
        ${
          active
            ? "text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }
        ${showLabel ? "" : "justify-center"}`}
        aria-label={label}
        title={showLabel ? undefined : label}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-lg bg-blue-100"
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
        className={`fixed inset-y-0 left-0 h-screen max-h-screen w-72 bg-white/90 backdrop-blur-xl border-r flex flex-col z-50 transition-all duration-300 shadow-xl shadow-blue-950/5
        ${open ? "lg:w-64" : "lg:w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto p-4 pt-8">
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

        <div className="mt-auto shrink-0 border-t bg-white/80 p-4 backdrop-blur">
          <button
            onClick={handleLogout}
            className={`gyano-button flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 ${
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
