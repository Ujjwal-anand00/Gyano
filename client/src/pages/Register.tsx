import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import Logo from "../assets/Gyano.png";
import Hero from "../assets/Hero.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-400 to-blue-300 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Join{" "}
            <span>
              <img src={Logo} className="h-10 inline" />
            </span>{" "}
            and start learning today!
          </h1>

          <img src={Hero} className="w-auto mx-auto mb-4" />

          <p className="text-indigo-100 text-lg">
            Start your learning journey today. Track progress, earn
            certificates, and build new skills.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-[380px]">
          <div className="flex items-center justify-center mb-6">
            <img src={Logo} className="h-10 w-auto " />
          </div>

          <p className="text-center text-gray-500 mb-2">Create your account</p>

          <div className="relative mb-4">
            <User size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Full name"
              className="w-full border rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative mb-4">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="email"
              placeholder="Email address"
              className="w-full border rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative mb-4">
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

          <div className="relative mb-6">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleRegister}
            className="bg-indigo-600 text-white w-full py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">Creating account...</span>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-center mt-6 text-gray-500">
            Already have an account?
            <Link
              to="/login"
              className="text-indigo-600 ml-1 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
