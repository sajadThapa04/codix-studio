import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { useCreateContact } from "../../Hooks/Contact/contactHooks";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import ContactCard from "../../Components/Features/ContactCard/ContactCard";

function ContactForm() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();
  const {
    mutate: createContact,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useCreateContact();
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
    }
  }, [isSuccess]);

  const handleSubmit = async (data) => {
    await createContact(data);
    return true;
  };

  const handleGoToHomepage = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark:bg-gray-900" : "bg-white"}`}>
      {/* Centered Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}>
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank you for contacting us!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your form has been submitted successfully. We'll contact you
                  within 24 hours.
                </p>
                <button
                  onClick={handleGoToHomepage}
                  className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  <span>Go to Homepage</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-col md:flex-row justify-center items-center py-10 gap-10">
        {/* Image Section with Text Above */}
        <div className="w-full md:w-1/2 lg:w-2/5 max-w-[600px]">
          <div className="mb-6 text-center">
            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <span className={darkMode ? "text-white" : "text-[#111418]"}>
                Let's Build Something Amazing
              </span>
            </motion.h3>
            <motion.p
              className={`text-lg mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}>
              Your vision + our expertise = digital excellence
            </motion.p>
            <motion.p
              className={darkMode ? "text-gray-400" : "text-gray-500"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              Reach out and let's start your digital journey today
            </motion.p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/contact-us.jpg"
              alt="Contact Us"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 lg:w-3/5 max-w-[600px]">
          <div className="flex flex-col w-full py-5">
            <h2
              className={`tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5 ${
                darkMode ? "text-white" : "text-[#111418]"
              }`}>
              Contact Us
            </h2>

            <ContactCard
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error?.message}
              onDismissError={reset}
              darkMode={darkMode}
            />

            {/* Footer with Animated Logo */}
            <div className="flex flex-col items-center mt-6">
              <Link
                to="/"
                className="flex items-center group relative mb-2"
                onMouseEnter={() => setHoveredItem("logo")}
                onMouseLeave={() => setHoveredItem(null)}>
                <span className="text-xl font-bold relative overflow-hidden">
                  <span className="relative inline-block">
                    <span className="inline-block text-rose-600 dark:text-rose-400">
                      Codix
                    </span>
                  </span>
                  <span className="relative inline-block ml-1 text-gray-900 dark:text-gray-100">
                    Studio
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ${
                      hoveredItem === "logo" ? "w-full" : "w-0"
                    }`}></span>
                </span>
              </Link>
              <p
                className={`text-base font-normal leading-normal pb-3 pt-1 px-4 text-center ${
                  darkMode ? "text-gray-300" : "text-[#111418]"
                }`}>
                Creating digital experiences that inspire and transform
                businesses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
