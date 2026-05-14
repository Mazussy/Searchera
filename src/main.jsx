import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/pages/loginPage.jsx";
import RegisterPage from "./components/pages/registerPage.jsx";
import NotFoundPage from "./components/pages/NotFoundPage.jsx";
import Companies from "./components/pages/Companies.jsx";
import Jobs from "./components/pages/Jobs.jsx";
import LandingPage from "./components/pages/LandingPage.jsx";
import AdminDashboard from "./components/pages/AdminDashboard.jsx";
import ProfilePage from "./components/pages/ProfilePage.jsx";
import ForEmployersPage from "./components/pages/ForEmployersPage.jsx";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./components/pages/ResetPasswordPage.jsx";
import "./index.css";
import App from "./App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "companies",
        element: <Companies />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "for-employers",
        element: <ForEmployersPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
