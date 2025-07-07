import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  HomeIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const NavBar = ({
  user = null,
  onUserLogout = () => {},
  userLoading = false,
  darkMode = false,
  toggleDarkMode = () => {},
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isTabletSize, setIsTabletSize] = useState(false);

  // Check screen size and handle resize
  useEffect(() => {
    const handleResize = () => {
      const tabletBreakpoint = 768; // Tailwind's md breakpoint
      const windowWidth = window.innerWidth;

      setIsTabletSize(windowWidth >= tabletBreakpoint && windowWidth < 1024);

      if (windowWidth >= tabletBreakpoint) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/services", label: "Services", icon: Squares2X2Icon },
    { path: "/portfolio", label: "Portfolio", icon: BriefcaseIcon },
    { path: "/about", label: "About-Us", icon: BuildingOfficeIcon },
    { path: "/blog", label: "Blog", icon: DocumentTextIcon },
    { path: "/contact", label: "Contact", icon: EnvelopeIcon },
  ];

  const userNavItems = [
    { path: "/account", label: "My Account", icon: UserIcon },
    { path: "/projects", label: "My Projects", icon: BriefcaseIcon },
    { path: "/invoices", label: "Invoices", icon: CurrencyDollarIcon },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className={`${
                isTabletSize ? "lg:hidden" : "md:hidden"
              } inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none`}
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

          {/* Desktop/Tablet Navigation */}
          <div
            className={`${
              isTabletSize ? "flex" : "hidden lg:flex"
            } items-center space-x-1 lg:space-x-2 xl:space-x-4`}>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label={darkMode ? "Light mode" : "Dark mode"}>
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Main navigation items - adjusted for tablet */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 lg:px-3 rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  }`
                }
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}>
                {isTabletSize ? (
                  <item.icon className="h-5 w-5" />
                ) : (
                  <>
                    <div className="relative">
                      <item.icon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 ${
                    hoveredItem === item.path ? "w-full" : "w-0"
                  }`}></span>
              </NavLink>
            ))}

            {/* User section */}
            {user ? (
              <div className="relative ml-1 lg:ml-2">
                <button
                  className="flex items-center space-x-1 focus:outline-none group"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onMouseEnter={() => setHoveredItem("user")}
                  onMouseLeave={() => setHoveredItem(null)}>
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:bg-blue-200 dark:group-hover:bg-gray-600">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : user.fullName ? (
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  {!isTabletSize && (
                    <ChevronDownIcon
                      className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                        isUserMenuOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {isUserMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50 ${
                      isTabletSize ? "max-h-96 overflow-y-auto" : ""
                    }`}
                    onMouseLeave={() => setIsUserMenuOpen(false)}>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email || "Member"}
                      </p>
                    </div>
                    {userNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}>
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        onUserLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      disabled={userLoading}>
                      {userLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing out...
                        </span>
                      ) : (
                        <>
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Sign out
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-600 dark:border-blue-400 transition-all duration-300">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-300">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isTabletSize ? "lg:hidden" : "md:hidden"
        } transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        } bg-white dark:bg-gray-800 shadow-lg`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {/* Dark mode toggle in mobile menu */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700">
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

          {/* Main navigation items */}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}>
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}

          {/* User section in mobile */}
          {user ? (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 py-2">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : user.fullName ? (
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.fullName || "User"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email || "Member"}
                  </div>
                </div>
              </div>

              {/* Mobile User Links */}
              <div className="mt-2 space-y-1">
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={() => {
                  onUserLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                disabled={userLoading}>
                {userLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing out...
                  </span>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sign out
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-600 dark:border-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}>
                Log in
              </Link>
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
