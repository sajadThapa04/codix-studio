import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  logoutUser,
} from "../../../Stores/Slices/client.slices";
import Navbar from "./NavBar/Navbar";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const Headers = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const user = useSelector(selectCurrentUser);
  const authStatus = useSelector((state) => state.client.status);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Debug log to verify user data
  console.log("Current user in Headers:", user);

  return (
    <>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user} // Pass the user object from Redux
        onUserLogout={handleLogout}
        userLoading={authStatus === "loading"}
      />

      {/* Mobile dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white shadow-lg z-50 md:hidden"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
        {darkMode ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
};

export default Headers;
