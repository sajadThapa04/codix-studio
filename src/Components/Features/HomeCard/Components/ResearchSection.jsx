import React from "react";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaMobileAlt,
  FaShoppingCart,
  FaUtensils,
  FaBuilding,
  FaHome,
  FaUserTie,
  FaRobot,
} from "react-icons/fa";

const ResearchSection = ({ darkMode }) => {
  // Research facts with colored icons and hover animations
  const researchFacts = [
    {
      id: "global",
      icon: <FaGlobe className="text-2xl text-blue-500" />,
      title: "Global Reach",
      stat: "4.9B",
      description: "Internet users worldwide (2023)",
    },
    {
      id: "mobile",
      icon: <FaMobileAlt className="text-2xl text-green-500" />,
      title: "Mobile Usage",
      stat: "79%",
      description: "Of all web traffic comes from mobile",
    },
    {
      id: "restaurants",
      icon: <FaUtensils className="text-2xl text-red-500" />,
      title: "Restaurants",
      stat: "82%",
      description: "With websites saw increased reservations",
    },
    {
      id: "construction",
      icon: <FaBuilding className="text-2xl text-yellow-500" />,
      title: "Construction",
      stat: "78%",
      description: "Gained more clients with online portfolios",
    },
    {
      id: "real-estate",
      icon: <FaHome className="text-2xl text-purple-500" />,
      title: "Real Estate",
      stat: "79%",
      description: "Of buyers start their search online",
    },
    {
      id: "consulting",
      icon: <FaUserTie className="text-2xl text-indigo-500" />,
      title: "Consulting",
      stat: "91%",
      description: "Increased credibility with professional sites",
    },
    {
      id: "ai",
      icon: <FaRobot className="text-2xl text-teal-500" />,
      title: "AI Adoption",
      stat: "67%",
      description: "Of businesses use AI for customer service",
    },
    {
      id: "ecommerce",
      icon: <FaShoppingCart className="text-2xl text-pink-500" />,
      title: "E-commerce",
      stat: "$6.3T",
      description: "Global online sales in 2023",
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
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      className={`py-16 px-4 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}>
          <motion.h2
            className="text-3xl font-bold mb-4"
            variants={itemVariants}>
            The Digital Advantage for Modern Businesses
          </motion.h2>
          <motion.p
            className="text-xl max-w-2xl mx-auto"
            variants={itemVariants}>
            Data-driven insights showing why every industry needs a strong
            online presence
          </motion.p>
        </motion.div>

        {/* Research Facts Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}>
          {researchFacts.map((fact, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg flex flex-col items-center text-center ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-sm`}
              variants={itemVariants}
              whileHover="hover">
              <motion.div
                className={`p-3 rounded-full mb-3 ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                variants={iconVariants}
                whileHover="hover">
                {fact.icon}
              </motion.div>
              <h3 className="font-bold text-lg">{fact.title}</h3>
              <p className="text-2xl font-bold my-2">{fact.stat}</p>
              <p className="text-sm">{fact.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchSection;
