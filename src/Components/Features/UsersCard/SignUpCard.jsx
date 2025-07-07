import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { ErrorMessage, SuccessMessage } from "../../Ui";

// Country data with flags and codes
const countryOptions = [
  { value: "US", code: "+1", label: "🇺🇸 +1", name: "United States" },
  { value: "GB", code: "+44", label: "🇬🇧 +44", name: "United Kingdom" },
  { value: "AU", code: "+61", label: "🇦🇺 +61", name: "Australia" },
  { value: "SG", code: "+65", label: "🇸🇬 +65", name: "Singapore" },
  { value: "IN", code: "+91", label: "🇮🇳 +91", name: "India" },
  { value: "NP", code: "+977", label: "🇳🇵 +977", name: "Nepal" },
  { value: "CN", code: "+86", label: "🇨🇳 +86", name: "China" },
];

const SignUpCard = ({
  onSubmit = () => {},
  isLoading = false,
  error = null,
  success = null,
  onDismissError = () => {},
  onDismissSuccess = () => {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);

  // Set default country based on user's IP
  // Set default country based on user's IP
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Try ipapi first
        const ipapiResponse = await fetch("https://ipapi.co/json/");
        if (ipapiResponse.ok) {
          const data = await ipapiResponse.json();
          const userCountry = data.country_code;
          const matchedCountry = countryOptions.find(
            (c) => c.value === userCountry
          );
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
            setValue("country", matchedCountry.value, { shouldValidate: true });
            setValue("countryCode", matchedCountry.code, {
              shouldValidate: true,
            });
            return;
          }
        }

        // Fallback to ip-api.com if ipapi fails
        const ipApiResponse = await fetch(
          "http://ip-api.com/json/?fields=countryCode"
        );
        if (ipApiResponse.ok) {
          const data = await ipApiResponse.json();
          const userCountry = data.countryCode;
          const matchedCountry = countryOptions.find(
            (c) => c.value === userCountry
          );
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
            setValue("country", matchedCountry.value, { shouldValidate: true });
            setValue("countryCode", matchedCountry.code, {
              shouldValidate: true,
            });
            return;
          }
        }
      } catch (error) {
        console.error("Error detecting country:", error);
        // Use Nepal as fallback since you're in Nepal
        const nepalCountry = countryOptions.find((c) => c.value === "NP");
        if (nepalCountry) {
          setSelectedCountry(nepalCountry);
          setValue("country", nepalCountry.value, { shouldValidate: true });
          setValue("countryCode", nepalCountry.code, {
            shouldValidate: true,
          });
        }
      }
    };

    detectCountry();
  }, [setValue]);

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

  const handleCountryChange = (e) => {
    const country = countryOptions.find((c) => c.value === e.target.value);
    if (country) {
      setSelectedCountry(country);
      setValue("country", country.value, { shouldValidate: true });
      setValue("countryCode", country.code, { shouldValidate: true });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-blue-100 mt-1">Join us today</p>
      </div>

      {/* Messages */}
      <div className="px-6 pt-4">
        {error && <ErrorMessage message={error} onDismiss={onDismissError} />}
        {success && (
          <SuccessMessage message={success} onDismiss={onDismissSuccess} />
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Full Name Field */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              type="text"
              placeholder="Codix Studio"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
          </div>
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </motion.div>

        {/* Email Field */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
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
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </motion.div>

        {/* Phone Field */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="flex rounded-md shadow-sm">
            <div className="relative">
              <select
                className="h-full pl-3 pr-8 py-3 border border-r-0 border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 appearance-none"
                {...register("country", {
                  required: "Country is required",
                  onChange: handleCountryChange,
                })}
                value={selectedCountry.value}>
                {countryOptions.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="1234567890"
              className="flex-1 block w-full pl-3 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{6,15}$/,
                  message:
                    "Invalid phone number (only digits, 6-15 characters)",
                },
              })}
            />
          </div>
          {/* Hidden input to store the actual country code */}
          <input type="hidden" {...register("countryCode")} />
          {errors.phoneNumber && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.phoneNumber.message}
            </p>
          )}
          {errors.country && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.country.message}
            </p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: {
                  hasUpper: (value) =>
                    /[A-Z]/.test(value) ||
                    "Must contain at least one uppercase letter",
                  hasLower: (value) =>
                    /[a-z]/.test(value) ||
                    "Must contain at least one lowercase letter",
                  hasNumber: (value) =>
                    /[0-9]/.test(value) || "Must contain at least one number",
                  hasSpecial: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    "Must contain at least one special character",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }>
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}>
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span>Sign Up</span>
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </div>
            )}
          </button>
        </motion.div>
      </form>

      {/* Login Link */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpCard;
