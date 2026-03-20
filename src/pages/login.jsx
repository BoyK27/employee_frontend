import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Added icons

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Visibility state

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/auth/login",
        { email, password },
      );

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        response.data.user.role === "admin"
          ? navigate("/admin-dashboard")
          : navigate("/employee-dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Server Error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6">
      {/* Branding - Responsive Font Sizes */}
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-xl">
          M-HUB ORCHARD BY PATRICK GLAINE
        </h2>
        <p className="text-teal-200 mt-2 font-medium tracking-widest text-xs sm:text-sm uppercase">
          Our All in One Control Center
        </p>
      </div>

      {/* Login Card - Specific widths for small screens */}
      <div
        className={`w-full max-w-[95%] sm:max-w-[420px] bg-white rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-300 ${error ? "animate-shake" : ""}`}
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          Enter your details to stay connected.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="example@gmail.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-base"
            />
          </div>

          {/* Password Field with Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
              />
              <span className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-teal-600 font-bold hover:text-teal-700 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 hover:shadow-teal-200"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>
      </div>

      <p className="mt-8 text-white/50 text-xs text-center uppercase tracking-widest">
        &copy; {new Date().getFullYear()} M-Hub Orchard Security
      </p>
    </div>
  );
}

export default Login;
