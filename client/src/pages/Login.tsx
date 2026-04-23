import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import Logo from "../assets/Gyano.png";
import Hero from "../assets/Hero.png";

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
    <div className="min-h-screen flex">
      {/* LEFT SIDE (BRANDING) */}

      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-400 to-blue-300 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="flex flex-row text-4xl font-bold mb-4">
            Welcome to{" "}
            <span>
              <img src={Logo} className="h-10" />
            </span>{" "}
          </h1>

          <img src={Hero} className="w-auto mx-auto mb-4" />

          <p className="text-indigo-100 text-lg">
            Learn new skills, track your progress, and unlock achievements
            through an engaging learning platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (LOGIN FORM) */}

      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-[380px]">
          {/* LOGO */}

          <div className="flex items-center justify-center mb-6">
            <img src={Logo} className="h-10 w-auto " />
          </div>
          <p className="text-center text-gray-500 mb-8">
            Sign in to your account
          </p>

          {/* EMAIL */}

          <div className="relative mb-4">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="email"
              placeholder="Email address"
              className="w-full border rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}

          <div className="relative mb-6">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            onClick={handleLogin}
            className="bg-indigo-600 text-white w-full py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              "Login"
            )}
          </button>

          {/* REGISTER LINK */}

          <p className="text-center mt-6 text-gray-500">
            Don't have an account?
            <Link
              to="/register"
              className="text-indigo-600 ml-1 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
