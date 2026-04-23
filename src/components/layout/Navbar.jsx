import React, { useState, useEffect, useRef } from "react";
import Login1 from "../../assets/icons/Login1.png";
import Login2 from "../../assets/icons/Login2.png";
import Login3 from "../../assets/icons/Login3.png";
import Login4 from "../../assets/icons/Login4.png";
import Login5 from "../../assets/icons/Login5.png";
import { Link, useLocation } from "react-router-dom";
import { Bell, CircleUserRound, Loader2 } from "lucide-react";
import {
  getNotificationDetails,
  getUserNotifications,
} from "../../utilities/api/notificationsApi";

const pickFirst = (obj, keys, fallback = null) => {
  if (!obj || typeof obj !== "object") {
    return fallback;
  }

  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return fallback;
};

const normalizeNotification = (rawNotification = {}) => {
  const readValue = pickFirst(rawNotification, [
    "isRead",
    "IsRead",
    "read",
    "Read",
    "status",
    "Status",
  ]);

  const normalizedRead =
    typeof readValue === "boolean"
      ? readValue
      : typeof readValue === "string"
        ? ["true", "read", "seen"].includes(readValue.toLowerCase())
        : false;

  return {
    id: pickFirst(rawNotification, [
      "id",
      "Id",
      "notificationId",
      "NotificationId",
    ]),
    message: pickFirst(rawNotification, ["message", "Message", "body", "Body"], ""),
    type: pickFirst(rawNotification, [
      "type",
      "Type",
      "notificationType",
      "NotificationType",
    ], 0),
    title: pickFirst(rawNotification, ["title", "Title", "subject", "Subject"], "Notification"),
    createdAt: pickFirst(rawNotification, [
      "createdAt",
      "CreatedAt",
      "date",
      "Date",
      "sentAt",
      "SentAt",
    ]),
    isRead: normalizedRead,
  };
};

const formatNotificationDate = (value) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleString();
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [loginIcon, setLoginIcon] = useState(Login1);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const notificationsPanelRef = useRef(null);
  const profileMenuPanelRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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

  useEffect(() => {
    if (!isLoggedIn) {
      setNotifications([]);
      setIsNotificationsOpen(false);
      setSelectedNotification(null);
      return;
    }

    let isMounted = true;

    const loadNotifications = async (isSilent = false) => {
      try {
        if (!isSilent) {
          setIsNotificationsLoading(true);
        }

        const data = await getUserNotifications();

        if (!isMounted) {
          return;
        }

        const normalized = data
          .map((item) => normalizeNotification(item))
          .filter((item) => item.id || item.message)
          .sort((a, b) => {
            const leftDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const rightDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return rightDate - leftDate;
          });

        setNotifications(normalized);
        setNotificationsError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setNotificationsError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load notifications.",
        );
      } finally {
        if (isMounted) {
          setIsNotificationsLoading(false);
        }
      }
    };

    loadNotifications();
    const intervalId = setInterval(() => loadNotifications(true), 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isNotificationsOpen) {
      return;
    }

    const handleOutsideClick = (event) => {
      if (
        notificationsPanelRef.current &&
        !notificationsPanelRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleOutsideClick = (event) => {
      if (
        profileMenuPanelRef.current &&
        !profileMenuPanelRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isProfileMenuOpen]);

  const handleNotificationOpen = () => {
    setIsProfileMenuOpen(false);
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = () => {
    setIsNotificationsOpen(false);
    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleNotificationSelect = async (notificationId) => {
    if (!notificationId) {
      return;
    }

    try {
      const details = await getNotificationDetails(notificationId);
      setSelectedNotification(normalizeNotification(details));
      setNotificationsError("");
    } catch (error) {
      setNotificationsError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load notification details.",
      );
    }
  };

  const unreadNotificationsCount = notifications.filter((item) => !item.isRead).length;
  const visibleMobileNotifications = notifications.slice(0, 3);
  const isProfilePage = location.pathname === "/profile";

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
                  className="text-primary text-[20px] font-avro font-normal cursor-pointer transition-colors hover:text-secondary-accent"
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

          {/* Login/Logout Button */}
          <div className="hidden md:flex shrink-0 items-center gap-3">
            {isLoggedIn && (
              <div className="relative" ref={notificationsPanelRef}>
                <button
                  type="button"
                  onClick={handleNotificationOpen}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ${
                    isNotificationsOpen
                      ? "text-[#111111]"
                      : "text-[#111111] hover:text-primary-accent"
                  }`}
                  aria-label="Open notifications"
                >
                  <Bell
                    className={`h-6.5 w-6.5 transition-transform duration-200 ${
                      isNotificationsOpen ? "rotate-12" : "hover:rotate-12"
                    }`}
                    strokeWidth={1.2}
                  />
                  {unreadNotificationsCount > 0 && (
                    <span
                      className="absolute bottom-2 left-2 h-2.5 w-2.5 rounded-full bg-[#F25D5D]"
                      aria-hidden="true"
                    />
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-gray-100 px-1 pb-2">
                      <p className="text-sm font-poppins-semibold text-primary">Notifications</p>
                      <span className="text-xs font-poppins text-gray-500">
                        {unreadNotificationsCount} unread
                      </span>
                    </div>

                    {isNotificationsLoading ? (
                      <div className="flex items-center justify-center py-6 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="py-6 text-center text-xs font-poppins text-gray-500">
                        No notifications yet.
                      </p>
                    ) : (
                      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                        {notifications.map((notification) => {
                          const isSelected = selectedNotification?.id === notification.id;

                          return (
                            <button
                              key={String(notification.id)}
                              type="button"
                              onClick={() => handleNotificationSelect(notification.id)}
                              className={`w-full rounded-xl border p-2.5 text-left transition-colors ${
                                isSelected
                                  ? "border-primary-accent/30 bg-[#FFF7F2]"
                                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-xs font-poppins-semibold text-primary">
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <span
                                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary-accent"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              <p className="mt-1 text-xs font-poppins text-gray-600">
                                {notification.message || "No message available."}
                              </p>
                              {notification.createdAt && (
                                <p className="mt-1 text-[10px] font-poppins text-gray-400">
                                  {formatNotificationDate(notification.createdAt)}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {selectedNotification && (
                      <div className="mt-3 rounded-xl border border-primary-accent/20 bg-[#FFF7F2] p-2.5">
                        <p className="text-xs font-poppins-semibold text-primary-accent">Selected</p>
                        <p className="mt-1 text-xs font-poppins text-gray-700">
                          {selectedNotification.message || "No message available."}
                        </p>
                      </div>
                    )}

                    {notificationsError && (
                      <p className="mt-2 text-xs font-poppins text-red-500">{notificationsError}</p>
                    )}
                  </div>
                )}
              </div>
            )}
            {isLoggedIn && (
              <div className="relative" ref={profileMenuPanelRef}>
                <button
                  type="button"
                  onClick={handleProfileMenuOpen}
                  aria-label="Open profile menu"
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ${
                    isProfilePage || isProfileMenuOpen
                      ? "text-[#111111]"
                      : "text-[#111111] hover:bg-[#FFF3ED]"
                  }`}
                >
                  <CircleUserRound className="h-8.5 w-8.5 text-[#111111]" strokeWidth={1.15} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-poppins-medium text-[#1A1A1A] transition-colors hover:bg-[#FFF3ED] hover:text-primary-accent"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-sm font-poppins-medium text-[#1A1A1A] transition-colors hover:bg-[#FFF3ED] hover:text-primary-accent"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-poppins-medium text-red-500 transition-colors hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isLoggedIn && (
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
            )}
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
            {isLoggedIn && (
              <a
                href="/profile"
                className="block text-primary hover:text-primary-accent font-medium text-sm py-2 transition-colors duration-200"
              >
                My Profile
              </a>
            )}
            {isLoggedIn && (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-poppins-semibold text-primary">Notifications</span>
                  <span className="text-[10px] font-poppins text-gray-500">
                    {unreadNotificationsCount} unread
                  </span>
                </div>
                {visibleMobileNotifications.length === 0 ? (
                  <p className="text-xs font-poppins text-gray-500">No notifications yet.</p>
                ) : (
                  <div className="space-y-1">
                    {visibleMobileNotifications.map((notification) => (
                      <p
                        key={String(notification.id)}
                        className="text-xs font-poppins text-gray-600"
                      >
                        {notification.message || "No message available."}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
