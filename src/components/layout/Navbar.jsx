import React, { useState } from "react";
import LoginIcon from "../../assets/images/Login.png";
import LoginHoverIcon from "../../assets/images/Login2.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);

  return (
    <nav className="bg-white border-b border-[#4242425C]/36 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a
              href="/"
              className="text-[30px] text-primary-accent font-normal font-alatsi hover:text-secondary-accent transition-colors"
            >
              SEARCHERA
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12 flex-1 justify-center">
            <a
              href="/jobs"
              className="text-primary text-[20px] font-avro font-normal hover:text-secondary-accent hover:border-b-2 hover:border-b-secondary-accent transition-all cursor-pointer"
            >
              Jobs
            </a>
            <a
              href="/companies"
              className="text-primary text-[20px] font-avro font-normal hover:text-secondary-accent hover:border-b-2 hover:border-b-secondary-accent transition-all cursor-pointer"
            >
              Companies
            </a>
            <a
              href="/career-advice"
              className="text-primary text-[20px] font-avro font-normal hover:text-secondary-accent hover:border-b-2 hover:border-b-secondary-accent transition-all cursor-pointer"
            >
              Career Advice
            </a>
            <a
              href="/for-employers"
              className="text-primary text-[20px] font-avro font-normal hover:text-secondary-accent hover:border-b-2 hover:border-b-secondary-accent transition-all cursor-pointer"
            >
              For Employers
            </a>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex shrink-0">
            <a
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#9B9A9A]/20 transition-all cursor-pointer"
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
            >
              <img
                src={isLoginHovered ? LoginHoverIcon : LoginIcon}
                alt="Login"
                className="w-6 h-6 transition-all"
              />
              <span
                className="text-[17px] font-normal"
                style={{ fontFamily: "Arial" }}
              >
                Login
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex-1 flex justify-end">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary hover:text-primary-accent focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-2 relative"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                {/* Burger Icon */}
                <svg
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen
                      ? "opacity-0 rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* X Icon */}
                <svg
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 space-y-3">
            <a
              href="/jobs"
              className="block text-primary hover:text-primary-accent font-medium text-sm py-2 transition-colors duration-200"
            >
              Jobs
            </a>
            <a
              href="/companies"
              className="block text-primary hover:text-primary-accent font-medium text-sm py-2 transition-colors duration-200"
            >
              Companies
            </a>
            <a
              href="/career-advice"
              className="block text-primary hover:text-primary-accent font-medium text-sm py-2 transition-colors duration-200"
            >
              Career Advice
            </a>
            <a
              href="/for-employers"
              className="block text-primary hover:text-primary-accent font-medium text-sm py-2 transition-colors duration-200"
            >
              For Employers
            </a>
            <a
              href="/login"
              className="flex items-center gap-2 text-primary hover:text-primary-accent font-medium text-sm py-2 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
