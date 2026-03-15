import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, User } from "lucide-react";
import api from "../../services/api";

function Navbar() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    if (name) {
      setUsername(name);
    }

    if (userRole) {
      setRole(userRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/login");
  };

  const handleSearch = async (value: string) => {

     console.log("Searching:", value)
    setSearch(value);

    if (value.length < 2) {
      setCourses([]);
      return;
    }

    const res = await api.get(`/api/courses/search?query=${value}`);
     console.log("API response:", res.data)

    setCourses(res.data);
  };

  return (
    <div className="h-16 bg-white/80 backdrop-blur border-b flex items-center justify-between px-8">
      {/* SEARCH BAR */}

      <div className="relative hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl w-96">
        <Search size={16} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-transparent outline-none ml-3 text-sm w-full placeholder-gray-400"
        />
        {search && courses.length > 0 && (
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
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-6">
        {/* NOTIFICATIONS */}

        <button className="relative hover:bg-gray-100 p-2 rounded-lg transition">
          <Bell size={20} className="text-gray-600" />

          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">
            2
          </span>
        </button>

        {/* USER PROFILE */}

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            {/* AVATAR */}

            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>

            {/* NAME */}

            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-800">
                {username || "User"}
              </span>

              <span className="text-xs text-gray-500 capitalize">{role}</span>
            </div>
          </button>

          {/* DROPDOWN */}

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden">
              <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm">
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

export default Navbar;
