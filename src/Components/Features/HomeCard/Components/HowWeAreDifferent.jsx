import React from "react";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaLockOpen,
  FaCode,
  FaGlobeAsia,
  FaHeadset,
  FaHandshake,
} from "react-icons/fa";

const HowWeAreDifferent = ({ darkMode }) => {
  // Differentiators cards
  const differentiators = [
    {
      icon: <FaMoneyBillWave className="text-3xl" />,
      title: "One-Time Fee, Lifetime Ownership",
      description: [
        "No recurring payments",
        "Full access to code, designs, and assets",
        "Transparent pricing upfront",
      ],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FaLockOpen className="text-3xl" />,
      title: "No Vendor Lock-In",
      description: [
        "Not tied to our servers or tech stack",
        "Freedom to host anywhere",
        "No forced maintenance plans",
      ],
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaCode className="text-3xl" />,
      title: "Full Technical Expertise",
      description: [
        "Web Design (UI/UX)",
        "Frontend & Backend Development",
        "DevOps, Hosting & SEO",
      ],
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FaGlobeAsia className="text-3xl" />,
      title: "Tailored for Nepal",
      description: [
        "Local user behavior expertise",
        "eSewa, Khalti integration",
        "Nepali SEO & marketing",
      ],
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "Support That Cares",
      description: [
        "Nepali-speaking team",
        "Post-launch assistance",
        "No hidden costs",
      ],
      color: "from-red-500 to-red-600",
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: "Transparency & Ethics",
      description: [
        "No upselling tactics",
        "Clear contracts",
        "Honest recommendations",
      ],
      color: "from-indigo-500 to-indigo-600",
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
      y: -10,
      scale: 1.02,
      boxShadow: darkMode
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className={`py-16 px-4 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      id="differentiators">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold mb-4">How We're Different</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Why choose us over competitors
          </p>
        </motion.div>

        {/* Differentiators Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}>
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-8 shadow-lg relative overflow-hidden group ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              variants={itemVariants}
              whileHover={cardVariants}>
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Icon with gradient background */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${item.color} text-white`}>
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>

                {/* Description list */}
                <ul className="space-y-2">
                  {item.description.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mt-2 mr-2 bg-gradient-to-br ${item.color}`}
                      />
                      <span className="text-gray-500 dark:text-gray-300">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowWeAreDifferent;
