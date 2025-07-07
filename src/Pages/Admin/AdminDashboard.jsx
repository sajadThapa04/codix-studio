// src/Pages/Admin/AdminDashboard.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";

function AdminDashboard() {
  const { darkMode, toggleDarkMode } = useOutletContext();

  return (
    <div className={`p-6 ${darkMode ? "dark" : ""}`}>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p className="text-gray-700 dark:text-gray-300">
        Welcome to the admin panel
      </p>
      <button
        onClick={toggleDarkMode}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </div>
  );
}

export default AdminDashboard;
