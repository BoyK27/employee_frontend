import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

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

        // Role-based redirection
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-600 to-blue-800 p-6">
      {/* Branding */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
          M-HUB ORCHARD
        </h2>
        <p className="text-teal-100 mt-2 font-medium">Management System</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="name@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 hover:shadow-teal-200"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-white/70 text-sm">
        &copy; {new Date().getFullYear()} M-Hub Orchard. All rights reserved.
      </p>
    </div>
  );
}

export default Login;
