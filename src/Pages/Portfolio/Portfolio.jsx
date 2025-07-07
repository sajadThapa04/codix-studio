import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PortfolioCard from "../../Components/Features/Portfolio/PortfolioCard";
import {
  ShoppingCartIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
  PaintBrushIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

function Portfolio() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const portfolioItems = [
    {
      imageSrc: "/images/E-commerce.png",
      title: "E-commerce Platform",
      description: "A sleek e-commerce platform for a fashion brand.",
      icon: <ShoppingCartIcon className="h-5 w-5" />,
    },
    {
      imageSrc: "/images/Mobile_Apps.png",
      title: "Mobile Application",
      description: "A dynamic mobile app for a tech startup.",
      icon: <DevicePhoneMobileIcon className="h-5 w-5" />,
    },
    {
      imageSrc: "/images/Web_development.png",
      title: "Corporate Website",
      description: "An engaging website for a corporate client.",
      icon: <ComputerDesktopIcon className="h-5 w-5" />,
    },
    {
      imageSrc: "/images/dashboard.png",
      title: "Analytics Dashboard",
      description: "A user-friendly dashboard for data visualization.",
      icon: <ChartBarIcon className="h-5 w-5" />,
    },
    {
      imageSrc: "/images/clothing-eCommerce.png",
      title: "Fashion Store",
      description: "Creative e-commerce solution for clothing brand.",
      icon: <PaintBrushIcon className="h-5 w-5" />,
    },
    {
      imageSrc: "/images/techsoltions.png",
      title: "Tech Solutions",
      description: "Landing page for IT services company.",
      icon: <GlobeAltIcon className="h-5 w-5" />,
    },
  ];

  const handleButtonClick = () => {
    navigate("/services");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`px-4 md:px-10 lg:px-20 xl:px-40 py-10 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-between gap-6 p-4">
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <h2
              className={`text-2xl md:text-3xl font-bold leading-tight ${
                darkMode ? "text-white" : "text-[#111418]"
              }`}>
              Our Work
            </h2>
            <p
              className={`text-sm md:text-base ${
                darkMode ? "text-gray-300" : "text-[#60758a]"
              }`}>
              We've partnered with innovative brands to create impactful digital
              experiences.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {portfolioItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <PortfolioCard
                imageSrc={item.imageSrc}
                title={item.title}
                description={item.description}
                darkMode={darkMode}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Compelling Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`mt-16 p-6 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className={`text-2xl md:text-3xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-[#111418]"
              }`}>
              Why Choose Us For Your Next Project?
            </h2>
            <div className="flex flex-col gap-6">
              <p
                className={`text-base leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-[#60758a]"
                }`}>
                Our portfolio showcases just a glimpse of what we can do. Each
                project represents a unique challenge we've solved with
                creativity and technical expertise. We don't just build websites
                and apps - we craft digital experiences that drive results.
              </p>
              <p
                className={`text-base leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-[#60758a]"
                }`}>
                What sets us apart is our commitment to understanding your
                business goals first. We take the time to learn about your
                audience, your challenges, and your vision before writing a
                single line of code. This approach ensures we deliver solutions
                that not only look great but perform exceptionally.
              </p>
              <p
                className={`text-base leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-[#60758a]"
                }`}>
                Whether you're a startup looking to make your mark or an
                established business needing a digital transformation, we have
                the skills and experience to bring your ideas to life. Let's
                create something remarkable together.
              </p>
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleButtonClick}
              className={`mt-8 px-8 py-3 rounded-lg font-medium transition-all ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-[#111418] hover:bg-[#22272e] text-white"
              }`}>
              Start Your Project
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Portfolio;
