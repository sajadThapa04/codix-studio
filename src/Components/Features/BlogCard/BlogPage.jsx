import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../Ui";
import {
  FaSearch,
  FaPlus,
  FaSpinner,
  FaHeart,
  FaEye,
  FaClock,
  FaImage,
} from "react-icons/fa";
import { useGetAllBlogs } from "../../../Hooks/Blog/blogHooks";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

const BlogPage = () => {
  const { darkMode } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const {
    data: responseData = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllBlogs({
    page: currentPage,
    limit: blogsPerPage,
    search: searchTerm,
  });

  const blogs = Array.isArray(responseData?.data?.blogs)
    ? responseData.data.blogs
    : [];
  const totalPages = responseData?.data?.pages || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header and Search - Optimized for dark mode */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-4 md:mb-0`}>
              Blog Posts
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className={`pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FaSearch
                  className={`absolute left-3 top-3 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </form>
              <Link
                to="/blog/create"
                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}>
                <FaPlus className="mr-2" />
                Create Post
              </Link>
            </div>
          </div>

          {/* Error State */}
          {isError && (
            <div
              className={`mb-6 ${darkMode ? "text-red-300" : "text-red-600"}`}>
              {error?.message || "Failed to load blog posts"}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div
              className={`flex justify-center items-center py-12 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
              <FaSpinner className="animate-spin text-4xl text-blue-500 mr-3" />
              Loading blogs...
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && blogs.length === 0 && (
            <div
              className={`text-center py-12 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
              <p className="text-lg mb-4">
                {searchTerm
                  ? "No blogs match your search criteria"
                  : "No blog posts available yet"}
              </p>
              {!searchTerm && (
                <Link
                  to="/blog/create"
                  className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                  Create your first blog post
                </Link>
              )}
            </div>
          )}

          {/* Blog Grid */}
          {!isLoading && !isError && blogs.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} darkMode={darkMode} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  darkMode={darkMode}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({ blog, darkMode }) => {
  if (!blog) return null;

  const displayContent = blog.content || blog.excerpt || "No content available";
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : 0;
  const viewCount = blog.views || 0;
  const readingTime = blog.readingTime || "1 min read";
  const [imageError, setImageError] = useState(false);

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
      {/* Cover Image or Placeholder */}
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
          whileHover={{ color: darkMode ? "#93c5fd" : "#2563eb" }} // light-blue-300 or blue-600
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

const Pagination = ({ currentPage, totalPages, onPageChange, darkMode }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border transition-colors ${
            darkMode
              ? "border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-gray-300"
              : "border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700"
          }`}>
          Previous
        </motion.button>

        {getPageNumbers().map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : darkMode
                ? "border border-gray-700 hover:bg-gray-700 text-gray-300"
                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}>
            {page}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border transition-colors ${
            darkMode
              ? "border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-gray-300"
              : "border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700"
          }`}>
          Next
        </motion.button>
      </nav>
    </div>
  );
};

export default BlogPage;
