import React, { useState } from "react";
import {
  FaPlus,
  FaTimes,
  FaTag,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorMessage } from "../../../Ui";

const CreateBlogCard = ({ onSubmit, isLoading }) => {
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
    status: "idle", // 'idle' | 'submitting' | 'success' | 'error'
    message: "",
  });

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
      message: "Creating your blog post...",
    });

    const blogData = {
      ...formData,
      seoTitle: formData.seoTitle || formData.title,
      ...(imageFile && {
        imageFile,
        altText: formData.altText || "",
      }),
    };

    onSubmit(blogData);
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
            <h2 className="text-3xl font-bold text-gray-800">
              Create New Blog Post
            </h2>
            <p className="text-gray-500 mt-2">
              Fill in the details below to publish your article
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
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Blog Title*
                    <span className="ml-2 text-xs text-gray-500">
                      (This will be your main headline)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.title
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="e.g., '10 Tips for Better Productivity'"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content*
                    <span className="ml-2 text-xs text-gray-500">
                      (Your article body)
                    </span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={10}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.content
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Write your content here... Markdown supported"
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Featured Image
                    <span className="ml-2 text-xs text-gray-500">
                      (Optional but recommended)
                    </span>
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="relative">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium">
                              Change Image
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Drag & drop an image here, or click to select
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Recommended size: 1200x630px • Max 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </motion.div>
                  {imagePreview && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Description (Alt Text)
                      </label>
                      <input
                        type="text"
                        name="altText"
                        value={formData.altText}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your image for accessibility"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category*
                    <span className="ml-2 text-xs text-gray-500">
                      (Helps organize your content)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.category
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="e.g., 'Productivity', 'Technology'"
                  />
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                    <span className="ml-2 text-xs text-gray-500">
                      (Helps readers find your content)
                    </span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="newTag"
                      value={formData.newTag}
                      onChange={handleChange}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Add tag (press Enter)"
                    />
                    <motion.button
                      type="button"
                      onClick={handleAddTag}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      <FaPlus />
                    </motion.button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <motion.span
                          key={tag}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                          <FaTag className="mr-1 text-blue-600" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800">
                            <FaTimes size={12} />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Add up to 10 tags to categorize your post
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Publication Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                      <option value="draft">Save as Draft</option>
                      <option value="published">Publish Immediately</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.status === "draft"
                        ? "Your post won't be visible to the public"
                        : "Your post will be published right away"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Featured Post
                      </span>
                    </label>
                    <p className="text-xs text-gray-500">
                      Featured posts may be highlighted on the homepage
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                      <FaInfoCircle className="mr-2 text-blue-500" />
                      SEO Optimization
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowSeoTooltip(!showSeoTooltip)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      aria-label="SEO Help">
                      <FaQuestionCircle />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showSeoTooltip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">
                          SEO (Search Engine Optimization) helps your blog post
                          appear in search results. Fill these fields to improve
                          visibility on Google and other search engines.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        SEO Title
                        <span className="ml-2 text-xs text-gray-500">
                          (Appears in search results)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Keep it under 60 characters"
                      />
                      <p className="text-xs text-gray-500">
                        {formData.seoTitle.length}/60 characters •{" "}
                        {formData.seoTitle ? (
                          <span className="text-green-600">Good length</span>
                        ) : (
                          <span>Will default to your blog title</span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        SEO Description
                        <span className="ml-2 text-xs text-gray-500">
                          (Appears under your title in search results)
                        </span>
                      </label>
                      <textarea
                        name="seoDescription"
                        value={formData.seoDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Briefly summarize your post (150-160 characters ideal)"
                      />
                      <p className="text-xs text-gray-500">
                        {formData.seoDescription.length}/160 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Keywords
                        <span className="ml-2 text-xs text-gray-500">
                          (Words people might search for)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="e.g., productivity, time management, work tips"
                      />
                      <p className="text-xs text-gray-500">
                        Separate with commas. These help search engines
                        understand your content.
                      </p>
                    </div>
                  </div>
                </div>
              </>
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
                  Publishing...
                </motion.span>
              ) : formData.status === "draft" ? (
                <motion.span variants={buttonTextVariants}>
                  Save as Draft
                </motion.span>
              ) : (
                <motion.span variants={buttonTextVariants}>
                  Publish Now
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

export default CreateBlogCard;
