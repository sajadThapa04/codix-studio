import React from "react";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footers = ({ darkMode = false }) => {
  return (
    <footer
      className={`mt-auto border-t ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                <span className="text-rose-600">Codix</span>
                <span className={darkMode ? "text-gray-100" : "text-gray-900"}>
                  Studio
                </span>
              </span>
            </Link>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
              Creating digital experiences that inspire and transform
              businesses.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}>
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a
                href="#"
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}>
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}>
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}>
                <FaLinkedinIn className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              } uppercase tracking-wider`}>
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { path: "/", label: "Home" },
                { path: "/services", label: "Services" },
                { path: "/portfolio", label: "Portfolio" },
                { path: "/team", label: "Team" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm ${
                      darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              } uppercase tracking-wider`}>
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { path: "/blog", label: "Blog" },
                { path: "/faq", label: "FAQ" },
                { path: "/testimonials", label: "Testimonials" },
                { path: "/careers", label: "Careers" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm ${
                      darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              } uppercase tracking-wider`}>
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <EnvelopeIcon
                  className={`h-5 w-5 flex-shrink-0 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`ml-3 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  info@codixstudio.com
                </span>
              </li>
              <li className="flex items-start">
                <PhoneIcon
                  className={`h-5 w-5 flex-shrink-0 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`ml-3 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start">
                <MapPinIcon
                  className={`h-5 w-5 flex-shrink-0 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`ml-3 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  123 Tech Street, Silicon Valley, CA 94025
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          className={`mt-8 pt-8 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } text-center md:text-left`}>
              © {new Date().getFullYear()} Codix Studio. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
