import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("JobSeeker");
  const [pendingProvider, setPendingProvider] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://searchera2026-001-site1.site4future.com/api/Account/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      alert("Login successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExternalLogin = (provider) => {
    setPendingProvider(provider);
    setShowRoleModal(true);
  };

  const confirmExternalLogin = () => {
    if (pendingProvider && selectedRole) {
      window.location.href = `https://searchera2026-001-site1.site4future.com/api/Account/ExternalLogin?provider=${pendingProvider}&role=${selectedRole}`;
    }
  };

  return (
    <div className="login-page min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SECTION */}
      <div className="login-left relative flex flex-col justify-center items-center px-8 md:px-28 bg-white py-12 overflow-y-auto">
        {/* Logo */}
        <h1 className="logo absolute top-8 left-8 md:left-28 text-primary-accent tracking-widest font-medium text-xl font-alatsi">
          SEARCHERA
        </h1>

        {/* CONTENT WRAPPER */}
        <div className="auth-content max-w-lg w-full">
          <h2 className="sub-header text-3xl font-semibold text-primary font-poppins">
            Welcome back!
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter your Credentials to access your account
          </p>

          {/* FORM */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="block text-sm font-medium font-poppins text-primary">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary-accent"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-primary">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  forgot password
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-accent"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="text-xs text-primary">Remember for 30 days</span>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#7A3E1D] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-10 flex items-center">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-xs text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social buttons */}
          <div className="social-buttons flex gap-6">
            <button
              type="button"
              onClick={() => handleExternalLogin("Google")}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm
                               hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <img
                src="src/assets/images/Google__G__logo.svg.png"
                alt="Google"
                className="w-4 h-4"
              />
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => handleExternalLogin("LinkedIn")}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm
                               hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <img
                src="src/assets/images/LinkedIn_icon.svg.png"
                alt="LinkedIn"
                className="w-4 h-4"
              />
              Sign in with LinkedIn
            </button>
          </div>

          {/* Signup link */}
          <p className="signin-link mt-6 text-center text-sm text-primary">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </div>
        {/* END auth-content */}
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section relative h-screen bg-gray-100 hidden md:block">
        <img
          src="src/assets/images/72be0103c7bc9699eb45bcda9cc0d1c0fd2b75fa.jpg"
          alt="Decorative"
          className="w-full h-full object-cover object-[center_95%]"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-semibold text-primary font-poppins mb-2">
              Choose Your Role
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-poppins">
              Select how you want to continue
            </p>

            <div className="space-y-4">
              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                  selectedRole === "JobSeeker"
                    ? "border-gray-300 bg-orange-50"
                    : "border-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="JobSeeker"
                  checked={selectedRole === "JobSeeker"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-5 h-5 text-primary-accent focus:ring-primary-accent cursor-pointer"
                  style={{ accentColor: "#D3571F" }}
                />
                <div>
                  <div className="font-medium text-primary font-poppins">
                    Job Seeker
                  </div>
                  <div className="text-xs text-gray-500 font-poppins">
                    Looking for opportunities
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                  selectedRole === "Employer"
                    ? "border-gray-300 bg-orange-50"
                    : "border-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="Employer"
                  checked={selectedRole === "Employer"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-5 h-5 text-primary-accent focus:ring-primary-accent cursor-pointer"
                  style={{ accentColor: "#D3571F" }}
                />
                <div>
                  <div className="font-medium text-primary font-poppins">
                    Employer
                  </div>
                  <div className="text-xs text-gray-500 font-poppins">
                    Hiring talent
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-primary font-medium font-poppins hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmExternalLogin}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary-accent text-white font-medium font-poppins hover:opacity-90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
