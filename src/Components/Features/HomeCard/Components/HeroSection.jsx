import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const HeroSection = ({ darkMode }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const fullText = "Digital Solutions";
  const typingSpeed = 100;
  const eraseSpeed = 50;
  const pauseDuration = 2000;

  useEffect(() => {
    let timeout;
    let currentIndex = 0;
    let isDeleting = false;

    const type = () => {
      if (isHovered) return;

      if (isDeleting) {
        setDisplayText(fullText.substring(0, currentIndex - 1));
        currentIndex--;

        if (currentIndex === 0) {
          isDeleting = false;
          timeout = setTimeout(type, pauseDuration);
        } else {
          timeout = setTimeout(type, eraseSpeed);
        }
      } else {
        setDisplayText(fullText.substring(0, currentIndex + 1));
        currentIndex++;

        if (currentIndex === fullText.length) {
          isDeleting = true;
          timeout = setTimeout(type, pauseDuration);
        } else {
          timeout = setTimeout(type, typingSpeed);
        }
      }
    };

    if (isTyping) {
      timeout = setTimeout(type, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [isTyping, isHovered]);

  return (
    <div
      className={`relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]">
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse">
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-start lg:gap-y-10">
        {/* Text content */}
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:px-8">
          <div className="lg:pr-4">
            <motion.div
              className="lg:max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}>
              <p
                className={`text-base/7 font-semibold ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}>
                Innovative Technology
              </p>
              <motion.h1
                className={`mt-2 text-4xl font-semibold tracking-tight text-pretty ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                } sm:text-5xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <span className="text-rose-600">Transformative</span>{" "}
                <span className="relative">
                  {displayText || "\u00A0"}
                  {!isHovered && (
                    <span
                      className={`absolute bottom-1 w-1 h-10 ${
                        darkMode ? "bg-white" : "bg-gray-900"
                      } animate-blink`}
                      style={{ animation: "blink 0.7s infinite" }}
                    />
                  )}
                </span>
              </motion.h1>
              <motion.p
                className={`mt-6 text-xl/8 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}>
                We create beautiful, functional digital experiences that help
                your business grow in today's competitive landscape.
              </motion.p>
              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/services"
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-rose-600 hover:bg-rose-700 text-white"
                    } shadow-sm hover:shadow-md flex items-center justify-center`}>
                    Explore Services
                    <ArrowRightIcon className="h-5 w-5 inline ml-2" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/contact"
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                    } shadow-sm hover:shadow-md flex items-center justify-center`}>
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Header Image */}
        <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}>
            <motion.img
              src="/images/Marketing/headerImage.jpg"
              alt="Digital Solutions"
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl sm:w-[57rem]"
              whileHover={{
                boxShadow: darkMode
                  ? "0 25px 50px -12px rgba(255, 255, 255, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 },
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Blinking cursor animation */}
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
