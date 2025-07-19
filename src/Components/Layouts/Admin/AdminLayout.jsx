// src/Components/Layouts/Admin/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import AdminNavBar from "./AdminNavBar";
import { Analytics } from "@vercel/analytics/react";
function AdminLayout() {
  const admin = useSelector((state) => state.admin.currentAdmin);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${
        darkMode ? "dark" : ""
      }`}>
      {admin && (
        <AdminNavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      <main className="container mx-auto px-4 py-8">
        <Outlet context={{ darkMode, toggleDarkMode }} />
      </main>
      <Analytics />
    </div>
  );
}

export default AdminLayout;
