import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  ServerStackIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Home = ({ darkMode = false }) => {
  const services = [
    {
      icon: CodeBracketIcon,
      title: "Web Development",
      description:
        "Custom websites built with modern technologies for optimal performance.",
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Mobile Apps",
      description:
        "Beautiful and functional mobile applications for iOS and Android.",
    },
    {
      icon: PaintBrushIcon,
      title: "UI/UX Design",
      description:
        "User-centered designs that enhance engagement and conversion.",
    },
    {
      icon: ServerStackIcon,
      title: "Cloud Solutions",
      description:
        "Scalable cloud infrastructure tailored to your business needs.",
    },
    {
      icon: ChartBarIcon,
      title: "Data Analytics",
      description:
        "Actionable insights from your data to drive business growth.",
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Hero Section */}
      <section
        className={`relative ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        } overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="relative z-10 text-center">
            <h1
              className={`text-4xl md:text-6xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
              <span className="text-rose-600">Innovative</span> Digital
              Solutions
            </h1>
            <p
              className={`text-xl md:text-2xl max-w-3xl mx-auto mb-8 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
              We create beautiful, functional digital experiences that help your
              business grow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/services"
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                } shadow-sm hover:shadow-md`}>
                Explore Services
                <ArrowRightIcon className="h-5 w-5 inline ml-2" />
              </Link>
              <Link
                to="/contact"
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                } shadow-sm hover:shadow-md`}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-0 opacity-10 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}></div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
            Our <span className="text-blue-600">Services</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
            Comprehensive digital solutions tailored to your business
            requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`rounded-xl p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50 border border-gray-200"
                } shadow-sm hover:shadow-md`}>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    darkMode
                      ? "bg-blue-900/20 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                  {service.title}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`${darkMode ? "bg-gray-800" : "bg-gray-50"} py-16 md:py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
            Ready to Transform Your Digital Presence?
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto mb-8 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            Let's work together to create something amazing for your business.
          </p>
          <Link
            to="/contact"
            className={`inline-flex items-center px-6 py-3 rounded-md font-medium transition-all duration-300 ${
              darkMode
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } shadow-sm hover:shadow-md`}>
            Get Started
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
