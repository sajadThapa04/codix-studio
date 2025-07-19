import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../../Stores/Slices/admin.slices";
import {
  FaHome,
  FaUsers,
  FaListUl,
  FaChartBar,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBlog,
} from "react-icons/fa";

const AdminNavBar = ({ darkMode, toggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const adminNavItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaHome size={20} />,
    },
    {
      path: "/admin/clients",
      label: "Clients",
      icon: <FaUsers size={20} />,
    },
    {
      path: "/admin/adminBlogs",
      label: "Blogs",
      icon: <FaBlog size={20} />,
    },
    {
      path: "/admin/services",
      label: "Services",
      icon: <FaListUl size={20} />,
    },
    {
      path: "/admin/reports",
      label: "Reports",
      icon: <FaChartBar size={20} />,
    },
    { path: "/admin/settings", label: "Settings", icon: <FaCog size={20} /> },
  ];

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getNavWidth = () => {
    if (isCollapsed && !isHovered) return "w-20";
    return "w-64";
  };

  return (
    <>
      {/* Mobile Header */}
      <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center h-16 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full focus:outline-none">
            {darkMode ? (
              <FaSun className="h-5 w-5 text-yellow-300" />
            ) : (
              <FaMoon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <div
        className={`fixed left-0 top-0 h-full ${getNavWidth()} bg-slate-50 dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out z-40
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="flex flex-col h-full p-4 relative">
          {/* Collapse Toggle Button - Fixed the positioning */}
          <button
            onClick={toggleCollapse}
            className={`hidden md:flex items-center justify-center absolute -right-3 top-5 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600 z-50
              hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200`}
            style={{ width: "28px", height: "28px" }}>
            {isCollapsed ? (
              <FaChevronRight className="text-gray-600 dark:text-gray-300 text-sm" />
            ) : (
              <FaChevronLeft className="text-gray-600 dark:text-gray-300 text-sm" />
            )}
          </button>

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            {(!isCollapsed || isHovered) && (
              <h1 className="text-[#0e141b] dark:text-white text-lg font-medium whitespace-nowrap">
                Admin Panel
              </h1>
            )}
            <button
              onClick={toggleDarkMode}
              className="md:hidden p-2 rounded-full">
              {darkMode ? (
                <FaSun className="h-5 w-5 text-yellow-300" />
              ) : (
                <FaMoon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-1">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg whitespace-nowrap ${
                    isActive
                      ? "bg-[#e7edf3] dark:bg-gray-700 text-[#0e141b] dark:text-white"
                      : "text-[#0e141b] dark:text-gray-300 hover:bg-[#e7edf3]/50 dark:hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}>
                <div className="text-[#0e141b] dark:text-gray-300">
                  {item.icon}
                </div>
                {(!isCollapsed || isHovered) && (
                  <p className="text-sm font-medium">{item.label}</p>
                )}
              </NavLink>
            ))}
          </div>

          {/* Admin Profile */}
          {admin && (
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 py-2">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#e7edf3] dark:bg-gray-700 flex items-center justify-center">
                    <FaUser
                      className="text-[#0e141b] dark:text-gray-300"
                      size={16}
                    />
                  </div>
                </div>
                {(!isCollapsed || isHovered) && (
                  <div className="ml-3 text-left overflow-hidden">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {admin.fullName || "Admin"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {admin.role === "superadmin" ? "Super Admin" : admin.role}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#e7edf3] dark:hover:bg-gray-700 mt-2 ${
                  isCollapsed && !isHovered ? "justify-center" : ""
                }`}>
                <FaSignOutAlt
                  className={isCollapsed && !isHovered ? "" : "mr-3"}
                  size={16}
                />
                {(!isCollapsed || isHovered) && "Sign out"}
              </button>
            </div>
          )}

          {/* Dark Mode Toggle (Desktop) */}
          {(!isCollapsed || isHovered) && (
            <div className="hidden md:block mt-4">
              <button
                onClick={toggleDarkMode}
                className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#e7edf3] dark:hover:bg-gray-700">
                {darkMode ? (
                  <>
                    <FaSun className="mr-3" size={16} />
                    Light Mode
                  </>
                ) : (
                  <>
                    <FaMoon className="mr-3" size={16} />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminNavBar;
