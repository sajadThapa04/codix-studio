import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaHeart, FaEye, FaClock, FaImage } from "react-icons/fa";
const BlogCard = ({ blog, darkMode }) => {
  const [imageError, setImageError] = useState(false);

  if (!blog) return null;

  const displayContent = blog.content || blog.excerpt || "No content available";
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : 0;
  const viewCount = blog.views || 0;
  const readingTime = blog.readingTime || "1 min read";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: darkMode
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg overflow-hidden h-full flex flex-col shadow-md ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError && blog.coverImage?.url ? (
          <motion.img
            src={blog.coverImage.url}
            alt={blog.coverImage?.altText || blog.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onError={handleImageError}
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
            <FaImage
              className={`text-4xl mb-2 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              No image available
            </p>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.isArray(blog.tags) &&
            blog.tags.slice(0, 3).map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                className={`px-2 py-1 text-xs rounded-full ${
                  darkMode
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-blue-100 text-blue-800"
                }`}>
                {tag}
              </motion.span>
            ))}
        </div>

        {/* Title */}
        <motion.h2
          whileHover={{ color: darkMode ? "#93c5fd" : "#2563eb" }}
          className={`text-xl font-bold mb-2 line-clamp-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
          <Link to={`/blog/${blog._id}`}>{blog.title || "Untitled Blog"}</Link>
        </motion.h2>

        {/* Content Excerpt */}
        <p
          className={`mb-4 line-clamp-3 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
          {displayContent}
        </p>
      </div>

      {/* Footer with Stats */}
      <div
        className={`p-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-100"
        }`}>
        <div
          className={`flex items-center justify-between text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center">
              <FaHeart
                className={`mr-1 ${darkMode ? "text-red-400" : "text-red-500"}`}
              />
              <span>{likeCount}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center">
              <FaEye
                className={`mr-1 ${
                  darkMode ? "text-blue-400" : "text-blue-500"
                }`}
              />
              <span>{viewCount}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center">
              <FaClock
                className={`mr-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span>{readingTime}</span>
            </motion.div>
          </div>
          <span>
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "Unknown date"}
          </span>
        </div>

        {/* Read More Link */}
        <motion.div whileHover={{ x: 5 }} className="text-right mt-3">
          <Link
            to={`/blog/${blog._id}`}
            className={`text-sm font-medium flex items-center justify-end ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}>
            Read More
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="ml-1">
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
