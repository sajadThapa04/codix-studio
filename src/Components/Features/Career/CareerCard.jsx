import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaMobileAlt,
  FaUserTie,
  FaPalette,
  FaServer,
  FaRobot,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

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
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

const positions = [
  {
    title: "Web Developer",
    description:
      "Join our team to build responsive, high-performance web applications using React, Next.js, and modern JavaScript frameworks.",
    icon: <FaLaptopCode className="text-blue-600 text-xl" />,
  },
  {
    title: "UI/UX Designer",
    description:
      "Shape exceptional digital experiences by conducting user research, creating wireframes, and designing intuitive interfaces.",
    icon: <FaPalette className="text-blue-600 text-xl" />,
  },
  {
    title: "Mobile App Developer",
    description:
      "Develop cross-platform mobile applications using React Native or native technologies for iOS/Android.",
    icon: <FaMobileAlt className="text-blue-600 text-xl" />,
  },
  {
    title: "Project Manager",
    description:
      "Lead agile development teams to deliver projects on time and within scope while maintaining high standards.",
    icon: <FaUserTie className="text-blue-600 text-xl" />,
  },
  {
    title: "Backend Engineer",
    description:
      "Architect and maintain scalable server-side systems using Node.js, Python, or Java.",
    icon: <FaServer className="text-blue-600 text-xl" />,
  },
  {
    title: "AI/ML Engineer",
    description:
      "Develop machine learning models and AI solutions to solve complex business problems.",
    icon: <FaRobot className="text-blue-600 text-xl" />,
  },
];

function CareerCard({
  darkMode = false,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  resumeFileName,
}) {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleApplyClick = (position) => {
    setSelectedPosition(position);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("application-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div
      className={`font-sans min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
      <div className="px-4 sm:px-6 md:px-16 lg:px-32 flex flex-1 justify-center py-8">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-between gap-3 p-4">
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
              Join Our Team
            </h1>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            <h3
              className={`text-lg font-bold px-4 pb-2 pt-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
              Open Positions
            </h3>

            <div
              className={`rounded-lg shadow-sm overflow-hidden mb-8 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}>
              {positions.map((position, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 sm:px-6 py-4 border-b ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-100 hover:bg-gray-50"
                  } transition-colors`}>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      darkMode ? "bg-blue-900" : "bg-blue-50"
                    }`}>
                    {position.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-base font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                      {position.title}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}>
                      {position.description}
                    </p>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleApplyClick(position)}
                      className={`w-full sm:w-auto flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium transition-colors ${
                        darkMode
                          ? "bg-blue-900 text-blue-100 hover:bg-blue-800"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}>
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              id="application-form"
              className={`rounded-lg shadow-sm p-4 sm:p-6 mb-8 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}>
              <h3
                className={`text-lg font-bold pb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                Application for {selectedPosition?.title}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                      htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      placeholder="Enter your full name"
                      className={`w-full rounded-lg p-3 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "border-gray-200 text-gray-900"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                      htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Enter your email address"
                      className={`w-full rounded-lg p-3 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "border-gray-200 text-gray-900"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                      htmlFor="phone">
                      Phone
                    </label>
                    <input
                      id="phone"
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                      placeholder="Enter your phone number"
                      className={`w-full rounded-lg p-3 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "border-gray-200 text-gray-900"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                      htmlFor="position">
                      Position Applied For
                    </label>
                    <div className="relative">
                      <select
                        id="position"
                        {...register("position", {
                          required: "Position is required",
                        })}
                        className={`w-full appearance-none rounded-lg p-3 text-sm sm:text-base pr-10 focus:ring-blue-500 focus:border-blue-500 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "border-gray-200 text-gray-900"
                        }`}
                        defaultValue={selectedPosition?.title || ""}>
                        <option value="">Select position</option>
                        {positions.map((position, index) => (
                          <option key={index} value={position.title}>
                            {position.title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiChevronDown
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                      </div>
                    </div>
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.position.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                      htmlFor="resume">
                      Resume
                    </label>
                    <div className="flex items-center">
                      <label className="flex-1 cursor-pointer">
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            darkMode
                              ? "border-gray-600 hover:border-blue-500 bg-gray-700"
                              : "border-gray-200 hover:border-blue-500"
                          }`}>
                          <div className="flex items-center">
                            <HiOutlineDocumentText
                              className={`mr-2 text-xl ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-sm sm:text-base ${
                                darkMode ? "text-gray-300" : "text-gray-500"
                              }`}>
                              {resumeFileName ||
                                "Upload your resume (PDF, DOC, DOCX)"}
                            </span>
                          </div>
                          <input
                            id="resume"
                            type="file"
                            {...register("resume", {
                              required: "Resume is required",
                            })}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                          />
                        </div>
                      </label>
                    </div>
                    {errors.resume && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.resume.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      className={`w-full px-6 py-3 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800"
                          : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                      } ${
                        isSubmitting ? "cursor-not-allowed opacity-90" : ""
                      }`}>
                      {isSubmitting ? (
                        <>
                          <ImSpinner8 className="animate-spin h-5 w-5" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CareerCard;
