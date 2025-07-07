import React, { useState } from "react";
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
} from "@heroicons/react/24/outline";

const ContactCard = ({
  onSubmit = () => {},
  isLoading = false,
  darkMode = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="w-full">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Full Name Field */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <p
              className={`text-base font-medium leading-normal pb-2 ${
                darkMode ? "text-gray-300" : "text-[#111418]"
              }`}>
              Full Name
            </p>
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
                }`}
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
              />
            </div>
            {errors.fullName && (
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
            <p
              className={`text-base font-medium leading-normal pb-2 ${
                darkMode ? "text-gray-300" : "text-[#111418]"
              }`}>
              Email Address
            </p>
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
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
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
            <p
              className={`text-base font-medium leading-normal pb-2 ${
                darkMode ? "text-gray-300" : "text-[#111418]"
              }`}>
              Phone Number
            </p>
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
                }`}
                {...register("phone", {
                  pattern: {
                    value:
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                    message: "Invalid phone number",
                  },
                })}
              />
            </div>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </motion.p>
            )}
          </label>
        </motion.div>

        {/* Country Field - Changed to text input */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <p
              className={`text-base font-medium leading-normal pb-2 ${
                darkMode ? "text-gray-300" : "text-[#111418]"
              }`}>
              Country
            </p>
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
                }`}
                {...register("country", {
                  required: "Country is required",
                  minLength: {
                    value: 2,
                    message: "Country must be at least 2 characters",
                  },
                })}
              />
            </div>
            {errors.country && (
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
                }`}
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
              />
            </div>
            {errors.subject && (
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
                }`}
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
              />
            </div>
            {errors.message && (
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
            disabled={isSubmitting || isLoading}
            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 text-sm font-bold leading-normal tracking-[0.015em] ${
              darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-[#0c7ff2]"
            } ${
              isSubmitting || isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}>
            {isSubmitting || isLoading ? (
              <span className="truncate text-white">Sending...</span>
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
