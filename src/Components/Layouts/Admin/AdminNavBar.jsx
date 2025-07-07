import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Squares2X2Icon,
  UsersIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { adminLogout } from "../../../Stores/Slices/admin.slices";

const AdminNavBar = ({ darkMode, toggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin.currentAdmin);

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { path: "/admin/users", label: "Users", icon: UsersIcon },
    { path: "/admin/projects", label: "Projects", icon: BriefcaseIcon },
    { path: "/admin/blog", label: "Blog", icon: DocumentTextIcon },
    { path: "/admin/testimonials", label: "Testimonials", icon: StarIcon },
    { path: "/admin/reviews", label: "Reviews", icon: ChatBubbleLeftRightIcon },
    { path: "/admin/invoices", label: "Invoices", icon: CurrencyDollarIcon },
    { path: "/admin/contacts", label: "Contacts", icon: EnvelopeIcon },
  ];

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
    setIsAdminMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu">
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <Link
              to="/"
              className="flex items-center ml-4 md:ml-0 group relative"
              onMouseEnter={() => setHoveredItem("logo")}
              onMouseLeave={() => setHoveredItem(null)}>
              <span className="text-xl font-bold text-gray-900 dark:text-white relative overflow-hidden">
                <span className="relative inline-block">
                  <span className="inline-block text-rose-600 dark:text-rose-400">
                    Codix
                  </span>
                </span>
                <span className="relative inline-block ml-1 text-gray-900 dark:text-gray-100">
                  Studio
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ${
                    hoveredItem === "logo" ? "w-full" : "w-0"
                  }`}></span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label={darkMode ? "Light mode" : "Dark mode"}>
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Admin navigation items */}
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
                  }`
                }>
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </NavLink>
            ))}

            {/* Admin profile dropdown */}
            {admin && (
              <div className="relative ml-2">
                <button
                  className="flex items-center space-x-1 focus:outline-none group"
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}>
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-gray-700 flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                      isAdminMenuOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isAdminMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50"
                    onMouseLeave={() => setIsAdminMenuOpen(false)}>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {admin.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        } bg-white dark:bg-gray-800 shadow-lg`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {/* Dark mode toggle in mobile menu */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700">
            {darkMode ? (
              <>
                <SunIcon className="h-5 w-5 mr-3 text-yellow-300" />
                Light Mode
              </>
            ) : (
              <>
                <MoonIcon className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                Dark Mode
              </>
            )}
          </button>

          {/* Admin navigation items */}
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-500 dark:hover:text-purple-400"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}>
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}

          {/* Admin profile in mobile */}
          {admin && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 py-2">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-gray-700 flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {admin.name || "Admin"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-500 dark:hover:text-purple-400">
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
