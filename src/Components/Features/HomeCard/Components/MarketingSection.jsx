import React from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaLaptopCode,
  FaClock,
  FaGlobe,
  FaUserCheck,
  FaSearch,
  FaMobile,
  FaRobot,
} from "react-icons/fa";
import { RiSeoFill } from "react-icons/ri";

const MarketingSection = ({ darkMode }) => {
  // Marketing images
  const marketingImage1 = "/images/Marketing/solutions1.jpg";
  const marketingImage2 = "/images/Marketing/solutions2.jpg";

  // Benefit cards with icons
  const benefitCards = [
    {
      title: "24/7 Availability",
      description: "Your business is always open to customers worldwide",
      icon: <FaClock className="text-2xl" />,
      color: "text-blue-500",
    },
    {
      title: "Global Market",
      description: "Reach customers beyond your local area",
      icon: <FaGlobe className="text-2xl" />,
      color: "text-green-500",
    },
    {
      title: "Customer Trust",
      description: "Professional online presence builds credibility",
      icon: <FaUserCheck className="text-2xl" />,
      color: "text-purple-500",
    },
    {
      title: "Discoverability",
      description: "93% of customer journeys begin with online search",
      icon: <FaSearch className="text-2xl" />,
      color: "text-yellow-500",
    },
  ];

  // Service cards with icons
  const serviceCards = [
    {
      title: "Web Development",
      description: "Custom websites tailored to your business needs",
      icon: <FaLaptopCode className="text-2xl" />,
      color: "text-indigo-500",
    },
    {
      title: "Mobile Optimization",
      description: "Responsive designs that work on all devices",
      icon: <FaMobile className="text-2xl" />,
      color: "text-pink-500",
    },
    {
      title: "SEO Strategy",
      description: "Get found by customers searching for your services",
      icon: <RiSeoFill className="text-2xl" />,
      color: "text-blue-400",
    },
    {
      title: "AI Integration",
      description: "Smart chatbots and personalized experiences",
      icon: <FaRobot className="text-2xl" />,
      color: "text-teal-500",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div
      className={`relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-24 lg:px-0 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
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

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-16 lg:grid-cols-2 lg:items-start lg:gap-y-10">
        {/* Text content - Why Go Digital */}
        <div className="px-4 sm:px-6 lg:px-8 lg:col-span-1">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p
                className={`text-base/7 font-semibold ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}>
                Digital Transformation
              </p>
              <h1
                className={`mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-pretty ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}>
                Expand Your Digital Presence
              </h1>
              <p
                className={`mt-4 sm:mt-6 text-lg sm:text-xl/8 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                In today's digital-first world, having a robust online presence
                is crucial for business success. We help you connect with
                customers anytime, anywhere.
              </p>
            </div>
          </div>
        </div>

        {/* First Marketing Image - Mobile first approach */}
        <div className="px-4 sm:px-6 lg:px-8 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
            className="relative w-full aspect-video lg:aspect-auto lg:h-full">
            <motion.img
              src={marketingImage1}
              alt="Digital Marketing"
              className="w-full h-full object-cover rounded-lg lg:rounded-xl shadow-lg"
              whileHover={{
                boxShadow: darkMode
                  ? "0 25px 50px -12px rgba(255, 255, 255, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 },
              }}
            />
          </motion.div>
        </div>

        {/* Features list - Why Go Digital */}
        <div className="px-4 sm:px-6 lg:px-8 lg:col-span-2">
          <div className="lg:pr-4">
            <div
              className={`max-w-xl text-base/7 lg:max-w-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              <p>
                We specialize in creating digital experiences that are not only
                visually stunning but also highly functional. From responsive
                designs to seamless user journeys, we ensure your digital
                presence stands out.
              </p>
              <ul
                role="list"
                className={`mt-6 sm:mt-8 space-y-6 sm:space-y-8 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                {benefitCards.map((card, index) => (
                  <motion.li
                    key={index}
                    className="flex gap-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    <motion.div
                      className={`mt-1 flex-none ${card.color}`}
                      variants={iconVariants}
                      whileHover="hover">
                      {card.icon}
                    </motion.div>
                    <span>
                      <strong
                        className={`font-semibold ${
                          darkMode ? "text-gray-100" : "text-gray-900"
                        }`}>
                        {card.title}.
                      </strong>{" "}
                      {card.description}
                    </span>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-6 sm:mt-8">
                Our team of digital experts works closely with you to understand
                your business goals and deliver solutions that drive real
                results. Whether you need an e-commerce platform, a corporate
                website, or a mobile app, we've got you covered.
              </p>
            </div>
          </div>
        </div>

        {/* Our Digital Solutions Section - Now with image on left and text on right */}
        <div className="px-4 sm:px-6 lg:px-8 lg:col-span-2 mt-12 sm:mt-16">
          <div className="lg:pr-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Second Marketing Image - Now on the left */}
              <div className="order-1 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  className="relative w-full aspect-video">
                  <motion.img
                    src={marketingImage2}
                    alt="Digital Solutions"
                    className="w-full h-full object-cover rounded-lg lg:rounded-xl shadow-lg"
                    whileHover={{
                      boxShadow: darkMode
                        ? "0 25px 50px -12px rgba(255, 255, 255, 0.1)"
                        : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.div>
              </div>

              {/* Text content - Now on the right */}
              <div className="order-2 lg:order-2">
                <p
                  className={`text-base/7 font-semibold ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                  Comprehensive Solutions
                </p>
                <h1
                  className={`mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-pretty ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}>
                  <span className="inline-flex items-center">
                    <FaLaptopCode className="mr-3" />
                    Our Digital Solutions
                  </span>
                </h1>
                <p
                  className={`mt-4 sm:mt-6 text-lg sm:text-xl/8 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                  We offer end-to-end digital solutions tailored to your
                  specific business needs, ensuring you stay ahead in the
                  competitive digital landscape.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services List with Icons - Full width below the image/text section */}
        <div className="px-4 sm:px-6 lg:px-8 lg:col-span-2">
          <div className="lg:pr-4">
            <div
              className={`max-w-xl text-base/7 lg:max-w-none ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              <p>
                Our comprehensive digital solutions are designed to help your
                business thrive in the online world. We combine cutting-edge
                technology with strategic thinking to deliver exceptional
                results.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                {serviceCards.map((card, index) => (
                  <motion.div
                    key={index}
                    className={`rounded-lg p-4 sm:p-6 shadow-md sm:shadow-lg relative overflow-hidden ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                    variants={itemVariants}
                    whileHover={cardVariants}>
                    <div className="relative z-10">
                      <motion.div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${card.color} bg-opacity-20`}
                        variants={iconVariants}
                        whileHover="hover">
                        {card.icon}
                      </motion.div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-6 sm:mt-8">
                With years of experience in digital transformation, we are
                committed to helping businesses of all sizes succeed online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingSection;
