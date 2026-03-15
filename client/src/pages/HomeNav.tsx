import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/Gyano.png";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-10 py-4 flex justify-between items-center">
        {/* LOGO */}

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src={Logo} className="h-10" />
        </div>

        {/* DESKTOP MENU */}

        <div className="hidden md:flex items-center gap-6 text-gray-600">
          {/* LANGUAGE SELECT */}

          <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="border px-3 py-1 rounded-md text-sm cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>

          <button
            onClick={() => navigate("/login")}
            className="hover:text-blue-600 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow"
          >
            Register
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}

      {open && (
        <div className="md:hidden bg-white border-t px-10 py-6 flex flex-col gap-4">
          {/* LANGUAGE SELECT MOBILE */}

          <select
            value={i18n.language}
            onChange={(e) => {
              const lang = e.target.value;
              i18n.changeLanguage(lang);
              localStorage.setItem("lang", lang);
            }}
            className="border px-3 py-1 rounded-md text-sm cursor-pointer hover:border-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>

          <button
            onClick={() => navigate("/login")}
            className="text-left text-gray-600 hover:text-blue-600"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
