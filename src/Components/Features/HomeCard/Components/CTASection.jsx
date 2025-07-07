import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const CtaSection = ({ darkMode }) => {
  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <motion.div
          className={`relative isolate overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-gray-900"
          } px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#3B82F6" />
                <stop offset={1} stopColor="#1D4ED8" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2
              className={`text-3xl font-semibold tracking-tight text-balance ${
                darkMode ? "text-white" : "text-white"
              } sm:text-4xl`}>
              Ready to Transform Your Digital Presence?
            </h2>
            <p
              className={`mt-6 text-lg/8 text-pretty ${
                darkMode ? "text-gray-300" : "text-gray-300"
              }`}>
              Let's work together to create something amazing for your business.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/contact"
                  className={`flex items-center rounded-md ${
                    darkMode
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  } px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}>
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <Link
                to="/about"
                className={`text-sm/6 font-semibold ${
                  darkMode ? "text-white" : "text-white"
                }`}>
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              alt="Website Development"
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              width={1824}
              height={1080}
              className={`absolute top-0 left-0 w-[57rem] max-w-none rounded-md ${
                darkMode
                  ? "bg-gray-700/5 ring-1 ring-gray-700/10"
                  : "bg-white/5 ring-1 ring-white/10"
              }`}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CtaSection;
