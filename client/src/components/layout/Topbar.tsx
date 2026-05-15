import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Menu } from "lucide-react";
import Logo from "../../assets/Gyano.png";
import ThemeToggle from "../ThemeToggle";

function Topbar({ setOpen, setMobileOpen }: any) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white/72 px-4 py-3 backdrop-blur-2xl dark:bg-slate-950/72 sm:px-6">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button onClick={() => setMobileOpen(true)} className="gyano-icon-button lg:hidden" aria-label="Open sidebar">
          <Menu size={24} />
        </button>

        {/* Desktop toggle */}
        <button
          onClick={() => setOpen((prev: boolean) => !prev)}
          className="gyano-icon-button hidden lg:inline-flex"
          aria-label="Collapse sidebar"
        >
          <Menu size={22} />
        </button>

        <img
          src={Logo}
          alt="Gyano Logo"
          className="h-8 hidden sm:block object-contain"
        />
      </div>

      {/* SEARCH BAR */}
      {/* <div className="relative hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl w-80 lg:w-96">
        <Search size={16} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-transparent outline-none ml-3 text-sm w-full"
        /> */}

        {/* SEARCH DROPDOWN */}
        {/* {search && courses.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {courses.map((course: any) => (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <p className="font-semibold text-sm">{course.title}</p>
                <p className="text-xs text-gray-500 truncate">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        {/* Notifications */}
        <button className="gyano-icon-button relative">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">
            2
          </span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-2xl px-2 py-2 transition hover:bg-slate-100/80 dark:hover:bg-white/8 sm:gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 font-semibold text-white shadow-lg shadow-blue-500/20">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold">
                {username || "User"}
              </span>
              <span className="text-xs capitalize text-muted-foreground">{role}</span>
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur dark:bg-slate-950/95">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-slate-100/80 dark:hover:bg-white/8"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
