// components/UpdateBlogCard.jsx
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorMessage } from "../../../Ui";
import BlogContentForm from "./Components/BlogContentForm";
import BlogSettingsForm from "./Components/BlogSettingForm";

const UpdateBlogCard = ({ blogData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    category: "",
    status: "draft",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    metaKeywords: "",
    newTag: "",
    altText: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [showSeoTooltip, setShowSeoTooltip] = useState(false);
  const [submissionState, setSubmissionState] = useState({
    status: "idle",
    message: "",
  });

  // Initialize form with blog data
  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || "",
        content: blogData.content || "",
        tags: blogData.tags || [],
        category: blogData.category || "",
        status: blogData.status || "draft",
        featured: blogData.featured || false,
        seoTitle: blogData.seoTitle || blogData.title || "",
        seoDescription: blogData.seoDescription || "",
        metaKeywords: blogData.metaKeywords || "",
        newTag: "",
        altText: blogData.altText || "",
      });

      if (blogData.imageUrl) {
        setImagePreview(blogData.imageUrl);
      }
    }
  }, [blogData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTag = () => {
    if (!formData.newTag.trim()) return;
    if (formData.tags.length >= 10) {
      setErrorMessage("You can add up to 10 tags maximum");
      setShowError(true);
      return;
    }
    if (formData.tags.includes(formData.newTag.trim())) {
      setErrorMessage("This tag already exists");
      setShowError(true);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, prev.newTag.trim()],
      newTag: "",
    }));
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrorMessage("Only image files are allowed (JPEG, PNG)");
      setShowError(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB");
      setShowError(true);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.title.trim()) validationErrors.title = "A title is required";
    if (!formData.content.trim())
      validationErrors.content = "Content is required";
    if (!formData.category.trim())
      validationErrors.category = "Please select a category";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmissionState({
      status: "submitting",
      message: "Updating your blog post...",
    });

    const updatedBlogData = {
      ...formData,
      seoTitle: formData.seoTitle || formData.title,
      ...(imageFile && {
        imageFile,
        altText: formData.altText || "",
      }),
    };

    onSubmit(updatedBlogData);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const tabContent = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    idle: {
      background: ["#2563eb", "#1d4ed8"],
      scale: 1,
    },
    submitting: {
      background: ["#1d4ed8", "#1e40af"],
      scale: 0.98,
    },
    success: {
      background: ["#10b981", "#059669"],
      scale: 1,
    },
    error: {
      background: ["#ef4444", "#dc2626"],
      scale: 1,
    },
  };

  const buttonTextVariants = {
    idle: { opacity: 1 },
    submitting: { opacity: 0.8 },
    success: { opacity: 1 },
    error: { opacity: 1 },
  };

  const buttonState = isLoading ? "submitting" : "idle";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaEdit className="mr-2" />
              Update Blog Post
            </h2>
            <p className="text-gray-500 mt-2">
              Modify the details below to update your article
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "content"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "settings"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                Settings
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6">
              <ErrorMessage message={errorMessage} onClose={handleCloseError} />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <motion.div
            key={activeTab}
            variants={tabContent}
            initial="hidden"
            animate="visible"
            className="space-y-6">
            {activeTab === "content" ? (
              <BlogContentForm
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                imagePreview={imagePreview}
                handleImageChange={handleImageChange}
              />
            ) : (
              <BlogSettingsForm
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
                showSeoTooltip={showSeoTooltip}
                setShowSeoTooltip={setShowSeoTooltip}
              />
            )}
          </motion.div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() =>
                setActiveTab(activeTab === "content" ? "settings" : "content")
              }
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
              {activeTab === "content"
                ? "Next: Settings →"
                : "← Back to Content"}
            </button>

            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              initial="idle"
              animate={buttonState}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="px-6 py-3 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              style={{
                background: "linear-gradient(to right, #2563eb, #1d4ed8)",
              }}>
              {isLoading ? (
                <motion.span
                  variants={buttonTextVariants}
                  className="flex items-center">
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
                  Updating...
                </motion.span>
              ) : (
                <motion.span variants={buttonTextVariants}>
                  Update Post
                </motion.span>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 4 }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full bg-blue-100 overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-full bg-blue-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submissionState.status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3 rounded-lg text-sm ${
                  submissionState.status === "submitting"
                    ? "bg-blue-50 text-blue-800"
                    : submissionState.status === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}>
                <div className="flex items-center">
                  {submissionState.status === "submitting" && (
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-blue-500"
                      viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {submissionState.status === "success" && (
                    <svg
                      className="h-4 w-4 mr-2 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {submissionState.status === "error" && (
                    <svg
                      className="h-4 w-4 mr-2 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  {submissionState.message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateBlogCard;
