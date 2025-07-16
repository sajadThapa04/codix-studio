import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck, FiUpload, FiX, FiPlus, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";

const EditServiceCard = ({ service, onSubmit, isSubmitting }) => {
  const categories = [
    "e-commerce development",
    "web development",
    "mobile app development",
    "SEO optimization",
    "graphic design",
    "content creation",
    "digital marketing",
    "UI/UX design",
    "branding",
    "video production",
    "copywriting",
    "custom solution",
    "business website",
    "portfolio showcase",
    "educational platform",
    "healthcare solution",
    "financial service",
    "entertainment platform",
    "restaurant website",
    "hotel booking system",
    "other",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: service?.title || "",
      category: service?.category || "",
      description: service?.description || "",
      features: service?.features || [],
      price: service?.price || 0,
      isCustomizable: service?.isCustomizable ?? true,
      deliveryTimeInDays: service?.deliveryTimeInDays || 7,
      tags: service?.tags || [],
      status: service?.status || "active",
    },
  });

  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(
    service?.thumbnail || null
  );
  const [featureError, setFeatureError] = useState("");
  const [tagError, setTagError] = useState("");

  const features = watch("features");
  const tags = watch("tags");

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("thumbnailFile", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setValue("thumbnailFile", null, { shouldValidate: true });
    setThumbnailPreview(null);
  };

  const addFeature = () => {
    if (!newFeature.trim()) {
      setFeatureError("Feature cannot be empty");
      return;
    }
    if (features.length >= 15) {
      setFeatureError("Maximum 15 features allowed");
      return;
    }
    if (features.includes(newFeature.trim())) {
      setFeatureError("This feature already exists");
      return;
    }
    setValue("features", [...features, newFeature.trim()], {
      shouldValidate: true,
    });
    setNewFeature("");
    setFeatureError("");
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setValue("features", updatedFeatures, { shouldValidate: true });
  };

  const addTag = () => {
    if (!newTag.trim()) {
      setTagError("Tag cannot be empty");
      return;
    }
    if (tags.length >= 10) {
      setTagError("Maximum 10 tags allowed");
      return;
    }
    if (tags.includes(newTag.trim())) {
      setTagError("This tag already exists");
      return;
    }
    setValue("tags", [...tags, newTag.trim()], { shouldValidate: true });
    setNewTag("");
    setTagError("");
  };

  const removeTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setValue("tags", updatedTags, { shouldValidate: true });
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-200">
        Edit Service
      </h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Title *
            </label>
            <input
              id="title"
              {...register("title", { required: "Title is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.title
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
              placeholder="Service title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Category *
            </label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Description *
            </label>
            <textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
              placeholder="Detailed description of the service"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Features *
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                (Add key features of your service)
              </span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                placeholder="Add feature (press Enter)"
                aria-label="Add feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                aria-label="Add feature button">
                <FiPlus />
              </button>
            </div>
            {featureError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {featureError}
              </p>
            )}
            {features.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 max-w-full overflow-x-auto">
                {features.map((feature, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm transition-colors duration-200 whitespace-nowrap">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors duration-200"
                      aria-label={`Remove feature: ${feature}`}>
                      <FiX size={12} />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Price ($) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
                valueAsNumber: true,
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.price
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Delivery Time */}
          <div>
            <label
              htmlFor="deliveryTimeInDays"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Delivery Time (days) *
            </label>
            <input
              id="deliveryTimeInDays"
              type="number"
              min="1"
              max="90"
              {...register("deliveryTimeInDays", {
                required: "Delivery time is required",
                min: { value: 1, message: "Minimum delivery time is 1 day" },
                max: { value: 90, message: "Maximum delivery time is 90 days" },
                valueAsNumber: true,
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.deliveryTimeInDays
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}
              placeholder="7"
            />
            {errors.deliveryTimeInDays && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {errors.deliveryTimeInDays.message}
              </p>
            )}
          </div>

          {/* Customizable */}
          <div className="flex items-center space-x-3 pt-5 md:pt-0">
            <input
              id="isCustomizable"
              type="checkbox"
              {...register("isCustomizable")}
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
            />
            <label
              htmlFor="isCustomizable"
              className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Is customizable?
            </label>
          </div>

          {/* Status */}
          <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:items-center md:space-x-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Status *
            </label>
            <select
              id="status"
              {...register("status", { required: "Status is required" })}
              className={`px-4 py-2 rounded-lg border ${
                errors.status
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200`}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Tags
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                (Add relevant tags)
              </span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                placeholder="Add tag (press Enter)"
                aria-label="Add tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                aria-label="Add tag button">
                <FiTag />
              </button>
            </div>
            {tagError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {tagError}
              </p>
            )}
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 max-w-full overflow-x-auto">
                {tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm whitespace-nowrap transition-colors duration-200">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100 transition-colors duration-200"
                      aria-label={`Remove tag: ${tag}`}>
                      <FiX size={12} />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div className="md:col-span-2">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                aria-label="Upload thumbnail">
                <FiUpload className="mr-2" />
                Upload
              </label>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              {thumbnailPreview && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                    aria-label="Remove thumbnail">
                    <FiX size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
                    d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditServiceCard;
