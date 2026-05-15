import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/Gyano.png";
import ThemeToggle from "../components/ThemeToggle";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/72 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/72">
      <div className="gyano-container flex items-center justify-between py-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
          aria-label="Go to Gyano homepage"
        >
          <img src={Logo} alt="Gyano" className="h-10 w-auto" />
        </button>

        <div className="hidden items-center gap-3 text-sm text-muted-foreground md:flex">
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="gyano-input h-10 w-36 cursor-pointer py-0"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="pa">Punjabi</option>
          </select>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="gyano-secondary-button px-4 py-2"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="gyano-primary-button px-4 py-2"
          >
            Register
          </button>
        </div>

        <button
          type="button"
          className="gyano-icon-button md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-border bg-white/90 px-4 py-5 backdrop-blur-2xl dark:bg-slate-950/92 md:hidden"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="gyano-input h-11 flex-1 cursor-pointer py-0"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="pa">Punjabi</option>
                </select>
                <ThemeToggle />
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="gyano-secondary-button w-full"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="gyano-primary-button w-full"
              >
                Register
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
