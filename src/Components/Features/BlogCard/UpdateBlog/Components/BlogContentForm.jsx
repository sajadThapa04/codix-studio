// components/BlogContentForm.jsx
import { FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";

const BlogContentForm = ({
  formData,
  errors,
  handleChange,
  imagePreview,
  handleImageChange,
}) => {
  return (
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
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
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
                  <span className="text-white font-medium">Change Image</span>
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
  );
};

export default BlogContentForm;
