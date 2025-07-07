// components/BlogSettingsForm.jsx
import {
  FaPlus,
  FaTimes,
  FaTag,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BlogSettingsForm = ({
  formData,
  errors,
  handleChange,
  handleAddTag,
  handleRemoveTag,
  showSeoTooltip,
  setShowSeoTooltip,
}) => {
  return (
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
              e.key === "Enter" && (e.preventDefault(), handleAddTag())
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
                SEO (Search Engine Optimization) helps your blog post appear in
                search results. Fill these fields to improve visibility on
                Google and other search engines.
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
              Separate with commas. These help search engines understand your
              content.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogSettingsForm;
