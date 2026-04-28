import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, User, Menu } from "lucide-react";
import api from "../../services/api";
import Logo from "../../assets/Gyano.png";

function Topbar({ setOpen, setMobileOpen }: any) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (value.length < 2) {
      setCourses([]);
      return;
    }

    const res = await api.get(`/api/courses/search?query=${value}`);
    setCourses(res.data);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button onClick={() => setMobileOpen(true)} className="lg:hidden">
          <Menu size={24} />
        </button>

        {/* Desktop toggle */}
        <button
          onClick={() => setOpen((prev: boolean) => !prev)}
          className="hidden lg:block"
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
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifications */}
        <button className="relative hover:bg-gray-100 p-2 rounded-lg">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">
            2
          </span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 hover:bg-gray-100 px-2 py-2 rounded-lg"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold">
                {username || "User"}
              </span>
              <span className="text-xs text-gray-500 capitalize">{role}</span>
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-red-500 text-sm"
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
