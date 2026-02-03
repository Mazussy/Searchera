import React, { useState, useEffect } from "react";
import Login1 from "../../assets/icons/login1.png";
import Login2 from "../../assets/icons/login2.png";
import Login3 from "../../assets/icons/login3.png";
import Login4 from "../../assets/icons/login4.png";
import Login5 from "../../assets/icons/login5.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [loginIcon, setLoginIcon] = useState(Login1);
  const [hoveredNav, setHoveredNav] = useState(null);

  const navItems = [
    {
      id: "jobs",
      label: "Jobs",
      title: "Find Your Perfect Job",
      description:
        "Discover job opportunities that match your skills and preferences. Filter by industry, role type, and location to find what fits you best.",
    },
    {
      id: "companies",
      label: "Companies",
      title: "Explore Top Companies",
      description:
        "Browse company profiles, see ratings and workplace insights, and learn what makes each employer unique before applying.",
    },
    {
      id: "career-advice",
      label: "Career Advice",
      title: "Get Your Career Advice",
      description:
        "Access expert tips on resumes, interviews, career growth, and job search strategies to help you succeed at every step.",
    },
    {
      id: "employers",
      label: "For Employers",
      title: "Post Jobs & Hire Talent",
      description:
        "Create your company profile, post job openings, and connect easily with qualified candidates using smart tools and AI support.",
    },
  ];

  useEffect(() => {
    if (isLoginHovered) {
      // Hover sequence: login1 -> login3 -> login2
      const timer1 = setTimeout(() => setLoginIcon(Login3), 0);
      const timer2 = setTimeout(() => setLoginIcon(Login2), 250);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // Unhover sequence: login4 -> login1
      const timer1 = setTimeout(() => setLoginIcon(Login4), 0);
      const timer2 = setTimeout(() => setLoginIcon(Login1), 250);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLoginHovered]);

  return (
    <nav className="bg-white border-b border-[#4242425C]/36 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              to={"/"}
              className="text-[30px] text-primary-accent font-normal font-alatsi hover:text-secondary-accent transition-colors"
            >
              SEARCHERA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12 flex-1 justify-center">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  to={
                    item.id === "employers" ? "/for-employers" : `/${item.id}`
                  }
                  className="text-primary text-[20px] font-avro font-normal cursor-pointer transition-colors"
                >
                  {item.label}
                </Link>

                {/* Dropdown Modal */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white border border-gray-200 rounded-lg shadow-lg px-6 py-5 transition-all duration-300 ${
                    hoveredNav === item.id
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-4 pointer-events-none"
                  }`}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <h3 className="text-[16px] font-avro font-bold text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#292624] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex shrink-0">
            <a
              href="/login"
              className="cursor-pointer"
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
            >
              <img
                src={loginIcon}
                alt="Login"
                className="w-auto h-8 transition-all duration-300 ease-in-out"
              />
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
