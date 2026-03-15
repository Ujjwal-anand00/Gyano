import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Layers,
  ClipboardList,
  LogOut,
  Trophy,
  Menu
} from "lucide-react";

import { useState } from "react";
import Logo from "../../assets/Gyano.png";

function Sidebar() {

  const [open,setOpen] = useState(true)

  const role = localStorage.getItem("role")
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  const navItem = (path:string,label:string,Icon:any) => {

    const active = location.pathname === path

    return (
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium
        ${
          active
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Icon size={18}/>
        {open && label}
      </Link>
    )
  }

  return (

    <div
      className={`bg-white border-r min-h-screen flex flex-col transition-all duration-300
      ${open ? "w-64" : "w-20"}`}
    >

      {/* HEADER */}

      <div className="flex items-center justify-between h-20 border-b px-4">

        {open && (
          <img
            src={Logo}
            className="h-10 object-contain"
          />
        )}

        <button
          onClick={()=>setOpen(!open)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={20}/>
        </button>

      </div>


      {/* NAVIGATION */}

      <div className="flex flex-col gap-2 p-4 flex-1">

        {role === "teacher" && (
          <>
            {navItem("/teacher","Dashboard",LayoutDashboard)}

            {navItem("/teacher/courses","Manage Courses",Layers)}

            {navItem("/teacher/lessons","Manage Lessons",BookOpen)}

            {navItem("/teacher/quiz","Add Quiz",ClipboardList)}

            {navItem("/teacher-analytics","Instructor Analytics",BarChart3)}

            {navItem("/leaderboard","Leaderboard",Trophy)}
          </>
        )}

        {role === "student" && (
          <>
            {navItem("/student","Dashboard",LayoutDashboard)}

            {navItem("/lessons","Lessons",BookOpen)}

            {navItem("/progress","Progress",BarChart3)}

            {navItem("/analytics","Analytics",BarChart3)}

            {navItem("/leaderboard","Leaderboard",Trophy)}
          </>
        )}

      </div>


      {/* LOGOUT */}

      <div className="border-t p-4">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition text-sm font-medium"
        >
          <LogOut size={18}/>
          {open && "Logout"}
        </button>

      </div>

    </div>
  )
}

export default Sidebar