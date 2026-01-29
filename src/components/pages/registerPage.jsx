import React from "react";

const RegisterPage = () => {
  return (
    <div className="register-page h-screen overflow-hidden grid grid-cols-2">

      {/* LEFT SECTION */}
      <div className="register-left relative flex flex-col justify-center items-center px-28 bg-white">

        {/* Logo */}
        <h1 className="logo absolute top-8 left-28 text-primary-accent tracking-widest font-medium text-xl font-alatsi">
          SEARCHERA
        </h1>

        {/* CONTENT WRAPPER */}
        <div className="auth-content max-w-lg w-full">

          <h2 className="sub-header text-3xl font-semibold text-primary font-poppins">
            Get Started Now
          </h2>

          {/* FORM */}
          <form className="mt-8 space-y-5">

            {/* Name */}
            <div className="form-group">
              <label className="block text-sm font-medium font-poppins text-primary">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary-accent"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="block text-sm font-medium font-poppins text-primary">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary-accent"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="text-sm font-medium text-primary">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-accent"
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-xs text-primary">
                I agree to the terms & policy
              </span>
            </div>

            {/* Signup button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#7A3E1D] py-3 text-sm font-medium text-white hover:opacity-90 transition"
            >
              Sign up
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
            <button className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm
                               hover:bg-gray-100 transition flex items-center justify-center gap-2">
              <img src="src/assets/images/Google__G__logo.svg.png" alt="Google" className="w-4 h-4" />
              Sign up with Google
            </button>
            <button className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm
                               hover:bg-gray-100 transition flex items-center justify-center gap-2">
              <img src="src/assets/images/LinkedIn_icon.svg.png" alt="LinkedIn" className="w-4 h-4" />
              Sign up with LinkedIn
            </button>
          </div>

          {/* Register link */}
          <p className="signin-link mt-6 text-center text-sm text-primary">
            Have an account?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Login
            </span>
          </p>

        </div>
        {/* END auth-content */}

      </div>

      {/* RIGHT SECTION */}
      <div className="right-section relative h-screen bg-gray-100">
        <img
          src="src/assets/images/72be0103c7bc9699eb45bcda9cc0d1c0fd2b75fa.jpg"
          alt="Decorative"
          className="w-full h-full object-cover object-[center_95%]"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

    </div>
  );
};

export default RegisterPage;

