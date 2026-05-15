import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import Logo from "../assets/Gyano.png";
import Hero from "../assets/Hero.png";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Student account created successfully");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="gyano-page-shell grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(20,184,166,0.34),transparent_28rem),radial-gradient(circle_at_86%_12%,rgba(99,102,241,0.36),transparent_24rem)]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-auto max-w-xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur">
            <Sparkles size={14} />
            Start your learning journey
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Join{" "}
            <img src={Logo} alt="Gyano" className="inline h-12 w-auto align-[-0.55rem]" />{" "}
            today
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Start your learning journey today. Track progress, earn
            certificates, and build new skills.
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
              <h2 className="text-3xl font-bold">Create your account</h2>
              <p className="mt-2 text-muted-foreground">
                Build skills with a focused learning workspace.
              </p>
            </div>

            <div className="grid gap-4">
              <label className="relative block">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full name"
                  autoComplete="name"
                  className="gyano-input pl-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

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
                  autoComplete="new-password"
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

              {password && (
                <div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((bar) => (
                      <span
                        key={bar}
                        className={`h-1.5 rounded-full transition ${
                          passwordStrength > bar
                            ? "bg-gradient-to-r from-blue-600 to-emerald-500"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Add length, numbers, capitals, and symbols for a stronger password.
                  </p>
                </div>
              )}

              <label className="relative block">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className="gyano-input pl-11"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="gyano-primary-button mt-2 w-full"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?
              <Link to="/login" className="ml-1 font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Register;
