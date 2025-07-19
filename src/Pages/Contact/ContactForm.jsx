import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useCreateContact,
  useCreateAuthenticatedContact,
} from "../../Hooks/Contact/contactHooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ContactCard from "../../Components/Features/ContactCard/ContactCard";
import {
  selectCurrentUser,
  selectIsAuthInitialized,
} from "../../Stores/Slices/client.slices";

function ContactForm() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  // Get auth state from Redux
  const user = useSelector(selectCurrentUser);
  const isAuthInitialized = useSelector(selectIsAuthInitialized);
  const isAuthenticated = !!user;

  // State for rate limit exceeded
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const [rateLimitError, setRateLimitError] = useState("");

  // Call both hooks unconditionally at the top level
  const createContactMutation = useCreateContact();
  const createAuthenticatedContactMutation = useCreateAuthenticatedContact();

  // Choose the appropriate mutation based on authentication status
  const contactMutation = isAuthenticated
    ? createAuthenticatedContactMutation
    : createContactMutation;

  const {
    mutate: createContact,
    isLoading,
    isSuccess,
    error,
    reset,
  } = contactMutation;

  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle rate limit errors
  useEffect(() => {
    if (error) {
      // Handle both structured errors and raw errors
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "You've reached the maximum number of contact requests (3) allowed within 24 hours. Please try again later.";

      // Clean up the error message
      const cleanErrorMessage = errorMessage
        .replace(/Error: /g, "")
        .replace(/<[^>]*>?/gm, "")
        .replace(/at file:\/\/.*/g, "")
        .replace(/at process.*/g, "")
        .trim();

      if (
        error.response?.status === 429 ||
        error.status === 429 ||
        errorMessage.includes("maximum number of contact requests")
      ) {
        setRateLimitExceeded(true);
        setRateLimitError(cleanErrorMessage);
        setLastSubmissionTime(new Date());
      } else {
        setRateLimitExceeded(false);
        setRateLimitError("");
      }
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      // Add a small delay before showing success to allow for button animation to complete
      const timer = setTimeout(() => {
        setShowSuccess(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleSubmit = async (data) => {
    if (rateLimitExceeded) return false;

    setIsSubmitting(true);
    try {
      await createContact(data);
      return true;
    } catch (err) {
      console.error("Error submitting contact form:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToHomepage = () => {
    setShowSuccess(false);
    navigate("/");
  };

  const handleCloseRateLimitError = () => {
    setRateLimitExceeded(false);
    setRateLimitError("");
    reset();
  };

  // Calculate time remaining for rate limit
  const getRateLimitTimeRemaining = () => {
    if (!lastSubmissionTime) return null;
    const now = new Date();
    const nextAvailableTime = new Date(
      lastSubmissionTime.getTime() + 24 * 60 * 60 * 1000
    );
    const diffMs = nextAvailableTime - now;

    if (diffMs <= 0) {
      setRateLimitExceeded(false);
      return null;
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${Math.round(diffMinutes)}m`;
  };

  // Show loading state while auth is initializing
  if (!isAuthInitialized) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "dark:bg-gray-900" : "bg-white"
        }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark:bg-gray-900" : "bg-white"}`}>
      {/* Centered Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              scale: { type: "spring", damping: 15, stiffness: 200 },
            }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}>
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}>
                  Thank you for contacting us!
                </motion.h3>
                <motion.p
                  className="text-gray-600 dark:text-gray-300 mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}>
                  Your form has been submitted successfully. We'll contact you
                  within 24 hours.
                </motion.p>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}>
                  <button
                    onClick={handleGoToHomepage}
                    className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                    <span>Go to Homepage</span>
                    <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Rate Limit Error Notification */}
      <AnimatePresence>
        {rateLimitExceeded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              scale: { type: "spring", damping: 15, stiffness: 200 },
            }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}>
              <div className="relative p-6">
                <button
                  onClick={handleCloseRateLimitError}
                  className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="px-6 pb-6 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                    <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}>
                  Submission Limit Reached
                </motion.h3>
                <motion.p
                  className="text-gray-600 dark:text-gray-300 mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}>
                  {rateLimitError}
                </motion.p>
                {getRateLimitTimeRemaining() && (
                  <motion.p
                    className="text-gray-600 dark:text-gray-300 mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}>
                    Please try again in {getRateLimitTimeRemaining()}.
                  </motion.p>
                )}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}>
                  <button
                    onClick={handleCloseRateLimitError}
                    className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                    <span>Understood</span>
                  </button>
                </motion.div>
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
              onDismissError={() => {
                reset();
                setRateLimitExceeded(false);
                setRateLimitError("");
              }}
              darkMode={darkMode}
              isAuthenticated={isAuthenticated}
              currentUser={user}
              isRateLimited={rateLimitExceeded}
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
