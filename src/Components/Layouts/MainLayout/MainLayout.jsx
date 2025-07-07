import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Headers from "../Headers/Headers";
import Footer from "../Footers/Footers";

function MainLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference or use system preference
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save preference to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "dark" : ""}`}>
      <header className="sticky top-0 z-50">
        <Headers darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>

      <main className="flex-grow">
        {/* Pass darkMode prop to all child routes */}
        <Outlet context={{ darkMode, toggleDarkMode }} />
      </main>

      <footer className="mt-auto">
        <Footer darkMode={darkMode} />
      </footer>
    </div>
  );
}

export default MainLayout;
