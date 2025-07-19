import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  PencilIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const ContactCard = ({
  onSubmit = () => {},
  isLoading = false,
  darkMode = false,
  isAuthenticated = false,
  currentUser = null,
  error = null,
  onDismissError = () => {},
  isRateLimited = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editableFields, setEditableFields] = useState({
    fullName: false,
    email: false,
    phone: false,
    country: false,
  });

  // Set form values when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.fullName) setValue("fullName", currentUser.fullName);
      if (currentUser.email) setValue("email", currentUser.email);
      if (currentUser.phone) setValue("phone", currentUser.phone);
      if (currentUser.country) setValue("country", currentUser.country);
    }
  }, [isAuthenticated, currentUser, setValue]);

  const toggleEditField = (fieldName) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const onFormSubmit = async (data) => {
    if (isRateLimited) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // After successful submission, make fields read-only again
      if (isAuthenticated) {
        setEditableFields({
          fullName: false,
          email: false,
          phone: false,
          country: false,
        });
      }
      reset();
    } catch (err) {
      // Errors are handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  // Watch field values to detect changes
  const watchedValues = watch();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="w-full">
      {/* Error Message */}
      {error && !isRateLimited && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 mx-4 max-w-[480px] mx-auto p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={onDismissError}
            className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Full Name Field */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <div className="flex justify-between items-center pb-2">
              <p
                className={`text-base font-medium leading-normal ${
                  darkMode ? "text-gray-300" : "text-[#111418]"
                }`}>
                Full Name
              </p>
              {isAuthenticated && currentUser?.fullName && !isRateLimited && (
                <button
                  type="button"
                  onClick={() => toggleEditField("fullName")}
                  className="flex items-center text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  {editableFields.fullName ? "Cancel" : "Edit"}
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-[#60758a]"
                  }`}
                />
              </div>
              <input
                placeholder="Enter your full name"
                className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-0 border h-14 pl-10 pr-3 text-base font-normal leading-normal ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                    : "bg-white border-[#dbe0e6] text-[#111418] placeholder-[#60758a] focus:border-[#dbe0e6]"
                } ${
                  isAuthenticated &&
                  currentUser?.fullName &&
                  !editableFields.fullName
                    ? "bg-gray-100 dark:bg-gray-600"
                    : ""
                } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must be less than 50 characters",
                  },
                })}
                readOnly={
                  (isAuthenticated &&
                    !!currentUser?.fullName &&
                    !editableFields.fullName) ||
                  isRateLimited
                }
                disabled={isRateLimited}
              />
            </div>
            {errors.fullName && !isRateLimited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </motion.p>
            )}
          </label>
        </motion.div>

        {/* Email Field */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <div className="flex justify-between items-center pb-2">
              <p
                className={`text-base font-medium leading-normal ${
                  darkMode ? "text-gray-300" : "text-[#111418]"
                }`}>
                Email Address
              </p>
              {isAuthenticated && currentUser?.email && !isRateLimited && (
                <button
                  type="button"
                  onClick={() => toggleEditField("email")}
                  className="flex items-center text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  {editableFields.email ? "Cancel" : "Edit"}
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-[#60758a]"
                  }`}
                />
              </div>
              <input
                placeholder="Enter your email address"
                className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-0 border h-14 pl-10 pr-3 text-base font-normal leading-normal ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                    : "bg-white border-[#dbe0e6] text-[#111418] placeholder-[#60758a] focus:border-[#dbe0e6]"
                } ${
                  isAuthenticated && currentUser?.email && !editableFields.email
                    ? "bg-gray-100 dark:bg-gray-600"
                    : ""
                } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                readOnly={
                  (isAuthenticated &&
                    !!currentUser?.email &&
                    !editableFields.email) ||
                  isRateLimited
                }
                disabled={isRateLimited}
              />
            </div>
            {errors.email && !isRateLimited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </motion.p>
            )}
          </label>
        </motion.div>

        {/* Phone Field */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <div className="flex justify-between items-center pb-2">
              <p
                className={`text-base font-medium leading-normal ${
                  darkMode ? "text-gray-300" : "text-[#111418]"
                }`}>
                Phone Number
              </p>
              {isAuthenticated && currentUser?.phone && !isRateLimited && (
                <button
                  type="button"
                  onClick={() => toggleEditField("phone")}
                  className="flex items-center text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  {editableFields.phone ? "Cancel" : "Edit"}
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-[#60758a]"
                  }`}
                />
              </div>
              <input
                placeholder="Enter your phone number"
                className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-0 border h-14 pl-10 pr-3 text-base font-normal leading-normal ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                    : "bg-white border-[#dbe0e6] text-[#111418] placeholder-[#60758a] focus:border-[#dbe0e6]"
                } ${
                  isAuthenticated && currentUser?.phone && !editableFields.phone
                    ? "bg-gray-100 dark:bg-gray-600"
                    : ""
                } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
                {...register("phone", {
                  pattern: {
                    value: /^\+?[0-9]{10,15}$/,
                    message: "Invalid phone number",
                  },
                })}
                readOnly={
                  (isAuthenticated &&
                    !!currentUser?.phone &&
                    !editableFields.phone) ||
                  isRateLimited
                }
                disabled={isRateLimited}
              />
            </div>
            {errors.phone && !isRateLimited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </motion.p>
            )}
          </label>
        </motion.div>

        {/* Country Field */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <div className="flex justify-between items-center pb-2">
              <p
                className={`text-base font-medium leading-normal ${
                  darkMode ? "text-gray-300" : "text-[#111418]"
                }`}>
                Country
              </p>
              {isAuthenticated && currentUser?.country && !isRateLimited && (
                <button
                  type="button"
                  onClick={() => toggleEditField("country")}
                  className="flex items-center text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  {editableFields.country ? "Cancel" : "Edit"}
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GlobeAltIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-[#60758a]"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="Enter your country"
                className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-0 border h-14 pl-10 pr-3 text-base font-normal leading-normal ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                    : "bg-white border-[#dbe0e6] text-[#111418] placeholder-[#60758a] focus:border-[#dbe0e6]"
                } ${
                  isAuthenticated &&
                  currentUser?.country &&
                  !editableFields.country
                    ? "bg-gray-100 dark:bg-gray-600"
                    : ""
                } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
                {...register("country", {
                  required: "Country is required",
                  minLength: {
                    value: 2,
                    message: "Country must be at least 2 characters",
                  },
                })}
                readOnly={
                  (isAuthenticated &&
                    !!currentUser?.country &&
                    !editableFields.country) ||
                  isRateLimited
                }
                disabled={isRateLimited}
              />
            </div>
            {errors.country && !isRateLimited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500">
                {errors.country.message}
              </motion.p>
            )}
          </label>
        </motion.div>

        {/* Subject Field */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <p
              className={`text-base font-medium leading-normal pb-2 ${
                darkMode ? "text-gray-300" : "text-[#111418]"
              }`}>
              Subject
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentTextIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-[#60758a]"
                  }`}
                />
              </div>
              <input
                placeholder="Enter the subject"
                className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-0 border h-14 pl-10 pr-3 text-base font-normal leading-normal ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                    : "bg-white border-[#dbe0e6] text-[#111418] placeholder-[#60758a] focus:border-[#dbe0e6]"
                } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
                {...register("subject", {
                  required: "Subject is required",
                  minLength: {
                    value: 5,
                    message: "Subject must be at least 5 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Subject must be less than 100 characters",
                  },
                })}
                readOnly={isRateLimited}
                disabled={isRateLimited}
              />
            </div>
            {errors.subject && !isRateLimited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500">
                {errors.subject.message}
              </motion.p>
            )}
          </label>
        </motion.div>

        {/* Message Field */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <p
              className={`text-base font-medium leading-normal pb-2 ${
                darkMode ? "text-gray-300" : "text-[#111418]"
              }`}>
              Your Message
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                <ChatBubbleLeftIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-[#60758a]"
                  }`}
                />
              </div>
              <textarea
                placeholder="Enter your message"
                rows={4}
                className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-0 border min-h-36 pl-10 pr-3 py-3 text-base font-normal leading-normal ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                    : "bg-white border-[#dbe0e6] text-[#111418] placeholder-[#60758a] focus:border-[#dbe0e6]"
                } ${isRateLimited ? "opacity-50 cursor-not-allowed" : ""}`}
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Message must be less than 1000 characters",
                  },
                })}
                readOnly={isRateLimited}
                disabled={isRateLimited}
              />
            </div>
            {errors.message && !isRateLimited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500">
                {errors.message.message}
              </motion.p>
            )}
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex px-4 py-3 mx-auto max-w-[480px]">
          <button
            type="submit"
            disabled={isSubmitting || isLoading || isRateLimited}
            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 text-sm font-bold leading-normal tracking-[0.015em] ${
              darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-[#0c7ff2]"
            } ${
              isSubmitting || isLoading || isRateLimited
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}>
            {isSubmitting || isLoading ? (
              <span className="truncate text-white">Sending...</span>
            ) : isRateLimited ? (
              <div className="flex items-center gap-2 text-white">
                <ClockIcon className="h-4 w-4" />
                <span className="truncate">Submission Limit Reached</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white">
                <span className="truncate">Send Message</span>
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ContactCard;
