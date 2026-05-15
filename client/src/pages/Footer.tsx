import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const footerLinks = {
  Platform: [
    "Courses",
    "Categories",
    "Teachers",
    "Certificates",
    "Learning Paths",
  ],

  Company: ["About", "Careers", "Blog", "Contact", "FAQ"],

  Resources: [
    "Documentation",
    "Help Center",
    "Community",
    "Privacy Policy",
    "Terms",
  ],
};

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">
      {/* glow effects */}

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />

      <div className="gyano-container relative z-10">

        {/* MAIN GRID */}

        <div className="grid gap-12 pb-14 mt-5 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}

          <div className="lg:col-span-2">
            <h2
              className="
            text-3xl
            font-bold
            text-white"
            >
              Gyano
            </h2>

            <p
              className="
            mt-5
            max-w-md
            leading-8
            text-slate-400"
            >
              Empowering learners with modern education, practical skills, and
              opportunities that create meaningful careers.
            </p>

            <div className="mt-8 flex gap-4">
              {[Github, Linkedin, Twitter, Instagram, Youtube].map(
                (Icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{
                      y: -5,
                      scale: 1.15,
                    }}
                    href="#"
                    className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-3
                  text-slate-300
                  backdrop-blur"
                  >
                    <Icon size={18} />
                  </motion.a>
                ),
              )}
            </div>
          </div>

          {/* links */}

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                className="
              mb-5
              font-semibold
              text-white"
              >
                {title}
              </h3>

              <div className="space-y-4">
                {links.map((link) => (
                  <Link
                    key={link}
                    to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="
                    group
                    flex
                    items-center
                    gap-2
                    text-slate-400
                    transition
                    hover:text-white"
                  >
                    {link}

                    <ArrowRight
                      size={14}
                      className="
                      opacity-0
                      transition
                      group-hover:translate-x-1
                      group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* bottom */}

        <div
          className="
        flex
        flex-col
        gap-4
        border-t
        border-white/10
        py-8
        text-sm
        text-slate-500
        md:flex-row
        md:items-center
        md:justify-between"
        >
          <p>© 2026 Gyano. All rights reserved.</p>

          <p>Made with ❤️ for learners.</p>

          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>

            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>

            <Link to="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
