import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  XMarkIcon,
  PaperClipIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const FrontendClientRequestCard = ({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  onCancel,
  onDelete,
  allowDelete = false,
  darkMode = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      category: "custom",
      description: "",
      features: [],
      budget: "",
      customBudget: "",
      deliveryDeadline: "",
      attachments: [],
    },
  });

  const [featureInput, setFeatureInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);

  // Set initial data if provided
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        category: initialData.category,
        description: initialData.description,
        features: initialData.features || [],
        budget: initialData.budget ? getBudgetRange(initialData.budget) : "",
        customBudget:
          initialData.budget &&
          !["100000", "300000", "500000", "1000000"].includes(
            getBudgetRange(initialData.budget)
          )
            ? initialData.budget
            : "",
        deliveryDeadline: initialData.deliveryDeadline
          ? new Date(initialData.deliveryDeadline).toISOString().split("T")[0]
          : "",
      });
      setAttachments(initialData.attachments || []);
    }
  }, [initialData, reset]);

  // Helper function to determine budget range
  const getBudgetRange = (amount) => {
    const numAmount = Number(amount);
    if (numAmount < 100000) return "100000";
    if (numAmount >= 100000 && numAmount < 300000) return "300000";
    if (numAmount >= 300000 && numAmount < 500000) return "500000";
    if (numAmount >= 500000) return "1000000";
    return "custom";
  };

  const currentFeatures = watch("features") || [];
  const selectedBudget = watch("budget");

  const handleAddFeature = () => {
    if (featureInput.trim() && !currentFeatures.includes(featureInput.trim())) {
      setValue("features", [...currentFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...currentFeatures];
    newFeatures.splice(index, 1);
    setValue("features", newFeatures);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setFileUploading(true);

    try {
      const newAttachments = files.map((file) => ({
        url: URL.createObjectURL(file),
        publicId: `temp-${Date.now()}-${file.name}`,
        resourceType: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : "raw",
        name: file.name,
        size: file.size,
      }));

      setAttachments([...attachments, ...newAttachments]);
      setValue("attachments", [...attachments, ...newAttachments]);
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setFileUploading(false);
    }
  };

  const handleRemoveAttachment = (publicId) => {
    const newAttachments = attachments.filter(
      (att) => att.publicId !== publicId
    );
    setAttachments(newAttachments);
    setValue("attachments", newAttachments);
  };

  const onSubmitForm = (data) => {
    const finalBudget =
      data.budget === "custom"
        ? Number(data.customBudget)
        : Number(data.budget);

    const formattedData = {
      ...data,
      budget: finalBudget || undefined,
      deliveryDeadline: data.deliveryDeadline || undefined,
      attachments: attachments,
    };

    delete formattedData.customBudget;
    onSubmit(formattedData);
  };

  const categories = [
    "e-commerce",
    "restaurant",
    "hotel",
    "portfolio",
    "custom",
    "business",
    "agency",
    "education",
    "healthcare",
    "finance",
    "entertainment",
    "other",
  ];

  // Dark mode classes
  const bgClass = darkMode ? "bg-gray-800" : "bg-white";
  const textClass = darkMode ? "text-gray-100" : "text-gray-900";
  const labelClass = darkMode ? "text-gray-300" : "text-gray-700";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-300";
  const inputClass = darkMode
    ? "bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
    : "bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500";
  const buttonPrimaryClass = darkMode
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white";
  const buttonSecondaryClass = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-white"
    : "bg-gray-200 hover:bg-gray-300 text-gray-700";
  const buttonDangerClass = darkMode
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-red-500 hover:bg-red-600 text-white";
  const featureTagClass = darkMode
    ? "bg-gray-700 text-gray-200"
    : "bg-gray-100 text-gray-800";
  const attachmentClass = darkMode
    ? "bg-gray-700 border-gray-600"
    : "bg-gray-50 border-gray-200";
  const radioClass = darkMode
    ? "text-blue-500 border-gray-600"
    : "text-blue-600 border-gray-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden ${bgClass} ${textClass}`}>
      <div className="p-6">
        <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>
          {initialData ? "Edit Service Request" : "Create New Service Request"}
        </h2>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Title*
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputClass} ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Category*
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputClass} appearance-none bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] bg-no-repeat bg-[center_right_1rem]`}>
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Description*
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={5}
              className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputClass} ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Describe your project in detail"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Features */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Features
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-xl border ${borderClass} ${inputClass}`}
                placeholder="Add a feature"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddFeature())
                }
              />
              <motion.button
                type="button"
                onClick={handleAddFeature}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl flex items-center gap-2 ${buttonPrimaryClass}`}>
                <PlusIcon className="h-5 w-5" />
                <span>Add</span>
              </motion.button>
            </div>
            {currentFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                <AnimatePresence>
                  {currentFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center ${featureTagClass} px-3 py-1.5 rounded-full`}>
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="ml-2 text-gray-500 hover:text-red-500">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Budget ($)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Under $100,000", value: "100000" },
                { label: "$100,000 - $300,000", value: "300000" },
                { label: "$300,000 - $500,000", value: "500000" },
                { label: "$500,000 and above", value: "1000000" },
                { label: "Custom Amount", value: "custom" },
              ].map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`budget-${option.value}`}
                    value={option.value}
                    {...register("budget")}
                    className={`h-4 w-4 border ${radioClass} focus:ring-blue-500`}
                  />
                  <label
                    htmlFor={`budget-${option.value}`}
                    className={`ml-2 block text-sm ${textClass}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Custom amount input */}
            {selectedBudget === "custom" && (
              <div className="mt-3 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  {...register("customBudget", {
                    required:
                      selectedBudget === "custom"
                        ? "Please enter an amount"
                        : false,
                    min: { value: 0, message: "Budget must be positive" },
                  })}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border ${borderClass} ${inputClass} ${
                    errors.customBudget ? "border-red-500" : ""
                  }`}
                  placeholder="Enter custom amount"
                />
                {errors.customBudget && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.customBudget.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Delivery Deadline */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Delivery Deadline
            </label>
            <div className="relative">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("deliveryDeadline")}
                className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputClass}`}
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              Attachments
            </label>
            <label
              className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer ${borderClass} hover:border-blue-500 transition-colors`}>
              <div className="flex flex-col items-center justify-center">
                <PaperClipIcon className="w-8 h-8 mb-2 text-gray-500" />
                <p className={`text-sm ${labelClass}`}>
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className={`text-xs ${labelClass}`}>Max file size: 10MB</p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={fileUploading}
                className="hidden"
              />
            </label>
            {fileUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-blue-500 flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                Uploading files...
              </motion.div>
            )}
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2">
                  {attachments.map((attachment) => (
                    <motion.div
                      key={attachment.publicId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`flex items-center justify-between p-3 border rounded-lg ${attachmentClass}`}>
                      <div className="flex items-center gap-3">
                        {attachment.resourceType === "image" ? (
                          <img
                            src={attachment.url}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-200">
                            <PaperClipIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="truncate max-w-xs">
                          <p className="text-sm font-medium truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveAttachment(attachment.publicId)
                        }
                        className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            {allowDelete && initialData && (
              <motion.button
                type="button"
                onClick={onDelete}
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-xl ${buttonDangerClass} disabled:opacity-50 flex items-center gap-2`}>
                <TrashIcon className="h-5 w-5" />
                Delete
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-xl ${buttonSecondaryClass} disabled:opacity-50`}>
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
              className={`px-6 py-2.5 rounded-xl ${buttonPrimaryClass} disabled:opacity-50 flex items-center gap-2 relative overflow-hidden`}>
              {isSubmitting ? (
                <>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                  />
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  {initialData ? "Updating..." : "Submitting..."}
                </>
              ) : initialData ? (
                "Update Request"
              ) : (
                "Create Request"
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default FrontendClientRequestCard;
