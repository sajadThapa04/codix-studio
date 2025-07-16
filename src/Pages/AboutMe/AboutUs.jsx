import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AboutCard from "../../Components/Features/AboutMe/AboutCard";
import { Modal } from "../../Components/Ui";
import {
  UsersIcon,
  ShieldCheckIcon,
  PresentationChartBarIcon,
  ArrowRightIcon,
  XMarkIcon,
  ShoppingCartIcon,
  TruckIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
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

function AboutUs() {
  const { darkMode } = useOutletContext();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const values = [
    {
      icon: <UsersIcon className="h-6 w-6" />,
      title: "Client-Centric Approach",
      description:
        "We prioritize our clients' needs, working closely to understand their goals and deliver personalized solutions.",
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: "Integrity and Transparency",
      description:
        "We uphold the highest ethical standards, ensuring transparency and honesty in all our interactions.",
    },
    {
      icon: <PresentationChartBarIcon className="h-6 w-6" />,
      title: "Innovation and Excellence",
      description:
        "We embrace innovation, continuously seeking new and improved ways to serve our clients and achieve exceptional results.",
    },
  ];

  const caseStudies = [
    {
      id: 1,
      title: "E-Commerce Transformation",
      service: "Web Development",
      description:
        "Revolutionized an online retail platform with modern technologies, boosting sales by 250%.",
      imageUrl:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      details: {
        challenge:
          "The client's outdated e-commerce platform was struggling with slow performance and poor mobile experience.",
        solution:
          "We built a Next.js e-commerce solution with headless CMS, optimized checkout flow, and personalized recommendations.",
        results: [
          "250% increase in conversion rates",
          "70% faster page load speeds",
          "Seamless mobile experience",
          "Integrated with existing ERP system",
        ],
        icon: <ShoppingCartIcon className="h-6 w-6 text-blue-500" />,
      },
    },
    {
      id: 2,
      title: "Logistics Optimization",
      service: "Mobile Apps",
      description:
        "Developed a fleet management app that reduced delivery times by 30%.",
      imageUrl:
        "https://images.unsplash.com/photo-1703226741497-6de4f67c6e11?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: {
        challenge:
          "Delivery drivers were using multiple disconnected systems causing inefficiencies.",
        solution:
          "Custom React Native app with real-time tracking, route optimization, and digital proof of delivery.",
        results: [
          "30% reduction in delivery times",
          "15% fuel cost savings",
          "Real-time package tracking",
          "Paperless operations",
        ],
        icon: <TruckIcon className="h-6 w-6 text-green-500" />,
      },
    },
    {
      id: 3,
      title: "Data Analytics Platform",
      service: "Data Analytics",
      description:
        "Built a business intelligence dashboard that uncovered $1.2M in savings opportunities.",
      imageUrl:
        "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: {
        challenge:
          "The company was making decisions based on outdated or incomplete data.",
        solution:
          "Interactive dashboards with real-time data integration from multiple sources and predictive analytics.",
        results: [
          "$1.2M annual cost savings identified",
          "75% faster reporting",
          "Automated KPI tracking",
          "Anomaly detection system",
        ],
        icon: <ChartBarIcon className="h-6 w-6 text-purple-500" />,
      },
    },
  ];

  const handleLearnMore = (study) => {
    setSelectedCaseStudy(study);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
  };

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
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
      <div className="max-w-[960px] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-between gap-3 p-4">
          <motion.div
            variants={itemVariants}
            className="flex min-w-72 flex-col gap-3">
            <h2
              className={`text-[32px] font-bold leading-tight tracking-light ${
                darkMode ? "text-white" : "text-[#131516]"
              }`}>
              About Us
            </h2>
            <p
              className={`text-sm font-normal leading-normal ${
                darkMode ? "text-gray-300" : "text-[#6b7780]"
              }`}>
              At Codix Studio, we are dedicated to providing innovative
              solutions and exceptional service to our clients. Our team of
              experts is committed to delivering results that exceed
              expectations.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          <h2
            className={`text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 ${
              darkMode ? "text-white" : "text-[#131516]"
            }`}>
            Our Mission
          </h2>
          <p
            className={`text-base font-normal leading-normal pb-3 pt-1 px-4 ${
              darkMode ? "text-gray-300" : "text-[#131516]"
            }`}>
            Our mission is to empower businesses with cutting-edge technology
            and strategic insights, enabling them to achieve sustainable growth
            and success in today's dynamic market. We strive to be a trusted
            partner, delivering tailored solutions that address unique
            challenges and drive tangible outcomes.
          </p>

          <h2
            className={`text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 ${
              darkMode ? "text-white" : "text-[#131516]"
            }`}>
            Our Values
          </h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AboutCard
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  darkMode={darkMode}
                />
              </motion.div>
            ))}
          </motion.div>

          <h2
            className={`text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 ${
              darkMode ? "text-white" : "text-[#131516]"
            }`}>
            Case Studies
          </h2>
          <motion.div variants={containerVariants} className="space-y-6 p-4">
            {caseStudies.map((study) => (
              <motion.div
                key={study.id}
                variants={itemVariants}
                className={`flex flex-col sm:flex-row items-stretch justify-between gap-4 rounded-xl p-4 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}>
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3
                      className={`text-base font-bold leading-tight ${
                        darkMode ? "text-white" : "text-[#131516]"
                      }`}>
                      {study.title}
                    </h3>
                    <p
                      className={`text-sm font-normal leading-normal ${
                        darkMode ? "text-gray-300" : "text-[#6b7780]"
                      }`}>
                      {study.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLearnMore(study)}
                    className={`flex items-center gap-2 min-w-[84px] max-w-[480px] cursor-pointer justify-center overflow-hidden rounded-xl h-8 px-4 w-fit ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-[#f1f2f3] text-[#131516] hover:bg-gray-200"
                    } transition-colors duration-200`}>
                    <span className="truncate">Learn More</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
                  style={{ backgroundImage: `url(${study.imageUrl})` }}></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex px-4 py-3 justify-center">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleGetStarted}
            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-[#b8d2e4] text-[#131516]"
            } text-base font-bold leading-normal tracking-[0.015em]`}>
            <span className="truncate">Get Started</span>
          </motion.button>
        </motion.div>

        {/* Case Study Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedCaseStudy?.title || "Case Study Details"}
          className={`${darkMode ? "bg-gray-800" : "bg-white"} max-w-2xl`}>
          {selectedCaseStudy && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {selectedCaseStudy.details.icon}
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                  {selectedCaseStudy.service}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-gray-800" : "text-gray-800"
                    }`}>
                    The Challenge
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-800" : "text-gray-600"
                    }`}>
                    {selectedCaseStudy.details.challenge}
                  </p>
                </div>

                <div>
                  <h4
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-gray-800" : "text-gray-800"
                    }`}>
                    Our Solution
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-800" : "text-gray-600"
                    }`}>
                    {selectedCaseStudy.details.solution}
                  </p>
                </div>

                <div>
                  <h4
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-gray-800" : "text-gray-800"
                    }`}>
                    Key Results
                  </h4>
                  <ul
                    className={`space-y-3 text-sm ${
                      darkMode ? "text-gray-800" : "text-gray-600"
                    }`}>
                    {selectedCaseStudy.details.results.map((result, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full mt-2 flex-shrink-0 ${
                            darkMode ? "bg-blue-400" : "bg-blue-600"
                          }`}></span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                  } transition-colors duration-200`}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </motion.div>
  );
}

export default AboutUs;
