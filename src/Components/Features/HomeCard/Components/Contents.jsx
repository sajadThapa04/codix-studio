import React from "react";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
} from "@heroicons/react/20/solid";

const CodixServices = ({ darkMode }) => {
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

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        {/* Text content */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p
                className={`text-base/7 font-semibold ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}>
                Build Smarter
              </p>
              <h1
                className={`mt-2 text-4xl font-semibold tracking-tight text-pretty ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                } sm:text-5xl`}>
                Your Vision, Our Expertise
              </h1>
              <p
                className={`mt-6 text-xl/8 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                At Codix, we transform ideas into stunning, functional websites.
                Whether you're a startup or an established business, we deliver
                tailored solutions to help you succeed online.
              </p>
            </div>
          </div>
        </div>

        {/* Image with hover animations */}
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
              alt="Web development"
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
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

        {/* Features list */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div
              className={`max-w-xl text-base/7 lg:max-w-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              <p>
                We specialize in creating custom websites that are not only
                visually appealing but also highly functional. From responsive
                designs to seamless user experiences, we ensure your website
                stands out in the digital landscape.
              </p>
              <ul
                role="list"
                className={`mt-8 space-y-8 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                <motion.li
                  className="flex gap-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <CodeBracketIcon
                    aria-hidden="true"
                    className={`mt-1 size-5 flex-none ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span>
                    <strong
                      className={`font-semibold ${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      }`}>
                      Custom Development.
                    </strong>{" "}
                    We build websites tailored to your unique needs, ensuring
                    scalability and performance.
                  </span>
                </motion.li>
                <motion.li
                  className="flex gap-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <ShieldCheckIcon
                    aria-hidden="true"
                    className={`mt-1 size-5 flex-none ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span>
                    <strong
                      className={`font-semibold ${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      }`}>
                      Secure & Reliable.
                    </strong>{" "}
                    Your website's security is our priority. We implement robust
                    measures to protect your data.
                  </span>
                </motion.li>
                <motion.li
                  className="flex gap-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <RocketLaunchIcon
                    aria-hidden="true"
                    className={`mt-1 size-5 flex-none ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span>
                    <strong
                      className={`font-semibold ${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      }`}>
                      Fast Deployment.
                    </strong>{" "}
                    We deliver projects on time, so you can launch your website
                    without delays.
                  </span>
                </motion.li>
              </ul>
              <p className="mt-8">
                Our team of experts works closely with you to understand your
                goals and deliver a website that drives results. Whether it's an
                e-commerce platform, a portfolio site, or a corporate website,
                we've got you covered.
              </p>
              <h2
                className={`mt-16 text-2xl font-bold tracking-tight ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}>
                Why Choose Codix?
              </h2>
              <p className="mt-6">
                With years of experience and a passion for innovation, we are
                committed to helping businesses thrive online. Let us handle the
                technical details while you focus on growing your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodixServices;
