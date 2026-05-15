import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import Logo from "../assets/Gyano.png";
import Hero from "../assets/Hero.png";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.name);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.id,
          name: res.data.name,
          role: res.data.role,
        }),
      );

      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="gyano-page-shell grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.45),transparent_28rem),radial-gradient(circle_at_88%_18%,rgba(20,184,166,0.24),transparent_24rem)]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-auto max-w-xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur">
            <Sparkles size={14} />
            Premium learning workspace
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to{" "}
            <img src={Logo} alt="Gyano" className="inline h-12 w-auto align-[-0.55rem]" />
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Learn new skills, track your progress, and unlock achievements
            through an engaging learning platform.
          </p>
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <img src={Hero} alt="Gyano learning preview" className="mx-auto rounded-3xl" />
          </div>
        </motion.div>
      </section>

      <section className="relative flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex justify-center">
            <img src={Logo} alt="Gyano" className="h-12 w-auto" />
          </div>

          <div className="gyano-glass-card p-6 sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold">Sign in</h2>
              <p className="mt-2 text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            <div className="grid gap-4">
              <label className="relative block">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  className="gyano-input pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="relative block">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="gyano-input pl-11 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="gyano-primary-button mt-2 w-full"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?
              <Link to="/register" className="ml-1 font-semibold text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Login;
