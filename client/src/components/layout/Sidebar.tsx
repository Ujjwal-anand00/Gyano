import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Layers,
  ClipboardList,
  LogOut,
  Trophy,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

function Sidebar({ open, mobileOpen, setMobileOpen }: any) {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

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
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium
        ${
          active
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Icon size={18} />
        {open && label}
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
        className={`fixed lg:static top-0 left-0 h-full bg-white border-r flex flex-col z-50 transition-all duration-300
        ${open ? "w-64" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex flex-col gap-2 p-4 flex-1 mt-6">
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
            </>
          )}

          {role === "student" && (
            <>
              {navItem("/student", "Dashboard", LayoutDashboard)}
              {navItem("/lessons", "Lessons", BookOpen)}
              {navItem("/progress", "Progress", BarChart3)}
              {navItem("/analytics", "Analytics", BarChart3)}
              {navItem("/leaderboard", "Leaderboard", Trophy)}
            </>
          )}
        </div>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
