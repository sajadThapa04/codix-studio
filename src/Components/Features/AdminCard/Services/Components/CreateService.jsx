import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  PlusIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../../../Ui";
import { motion } from "framer-motion";

const CreateService = ({ onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    resetField,
  } = useForm();

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [tagError, setTagError] = useState("");

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

  const features = watch("features") || [];
  const tags = watch("tags") || [];

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("thumbnailFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    resetField("thumbnailFile");
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

    setValue("features", [...features, newFeature.trim()]);
    setNewFeature("");
    setFeatureError("");
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setValue("features", updatedFeatures);
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

    setValue("tags", [...tags, newTag.trim()]);
    setNewTag("");
    setTagError("");
  };

  const removeTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setValue("tags", updatedTags);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-50 dark:bg-gray-700 px-8 py-5 border-b border-gray-200 dark:border-gray-600 flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Go back">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Create New Service
          </h2>
        </div>

        {/* Card Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Service Title<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="E-Commerce Website"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category<span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition">
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters",
                  },
                })}
                rows={5}
                placeholder="Describe your service in detail..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Features<span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                  (Add key features of your service)
                </span>
              </label>
              <div className="flex max-w-lg">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition"
                  placeholder="Add feature (press Enter)"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label="Add feature">
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              {featureError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {featureError}
                </p>
              )}
              {features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3 max-w-4xl">
                  {features.map((feature, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-3 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 focus:outline-none"
                        aria-label={`Remove feature ${feature}`}>
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Delivery Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Price ($)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  placeholder="e.g., 1500"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Time (Days)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("deliveryTimeInDays", {
                    required: "Delivery time is required",
                    min: { value: 1, message: "Minimum 1 day" },
                  })}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition"
                />
                {errors.deliveryTimeInDays && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.deliveryTimeInDays.message}
                  </p>
                )}
              </div>
            </div>

            {/* Customizable & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Customizable
                </label>
                <div className="flex space-x-8">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      {...register("isCustomizable")}
                      value="true"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 text-base">
                      Yes
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      {...register("isCustomizable")}
                      value="false"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 text-base">
                      No
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Status<span className="text-red-500">*</span>
                </label>
                <select
                  {...register("status", {
                    required: "Status is required",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition"
                  defaultValue="">
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tags
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                  (Optional, max 10)
                </span>
              </label>
              <div className="flex max-w-lg">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white transition"
                  placeholder="Add tag (press Enter)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  aria-label="Add tag">
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              {tagError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {tagError}
                </p>
              )}
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3 max-w-4xl">
                  {tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-3 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100 focus:outline-none"
                        aria-label={`Remove tag ${tag}`}>
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Service Thumbnail
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                  (Optional, max 1 image)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="thumbnail"
                  className="cursor-pointer inline-flex items-center px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                  Upload Image
                </label>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
                {thumbnailPreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img
                      src={thumbnailPreview}
                      alt="Service Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      aria-label="Remove thumbnail">
                      <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600 text-right">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition">
                {isLoading && <LoadingSpinner />}
                Create Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
