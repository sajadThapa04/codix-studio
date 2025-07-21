import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Modal } from "../../Ui";
import {
  FaSearch,
  FaPlus,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { useGetAllBlogs } from "../../../Hooks/Blog/blogHooks";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../Stores/Slices/client.slices";
import BlogCard from "./BlogCard";
import { debounce } from "lodash";

// Skeleton Loading Component
const BlogCardSkeleton = ({ darkMode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`rounded-lg overflow-hidden h-full flex flex-col shadow-md ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}>
    <div
      className={`h-48 ${
        darkMode ? "bg-gray-700" : "bg-gray-200"
      } animate-pulse`}></div>
    <div className="p-6 flex-grow space-y-3">
      <div className="flex flex-wrap gap-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`h-6 w-16 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse`}></div>
        ))}
      </div>
      <div
        className={`h-6 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } animate-pulse w-3/4`}></div>
      <div className="space-y-2">
        <div
          className={`h-4 rounded-full ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } animate-pulse`}></div>
        <div
          className={`h-4 rounded-full ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } animate-pulse w-5/6`}></div>
        <div
          className={`h-4 rounded-full ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } animate-pulse w-2/3`}></div>
      </div>
      <div
        className={`mt-6 h-4 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } animate-pulse w-1/2`}></div>
    </div>
  </motion.div>
);

const BlogPage = () => {
  const { darkMode } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const blogsPerPage = 6;
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  // Memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setSearchTerm(query);
        setPage(1);
        setAllBlogs([]);
        setHasMore(true);
      }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  // Clear search input
  const clearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    setPage(1);
    setAllBlogs([]);
    setHasMore(true);
  };

  // Calculate blog interest score
  const calculateInterestScore = (blog) => {
    // Base score on various factors (adjust weights as needed)
    let score = 0;

    // More recent blogs get higher score
    const daysOld =
      (new Date() - new Date(blog.createdAt)) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 30 - daysOld) * 2; // More weight to recent posts

    // Blogs with more likes get higher score
    score += (blog.likes?.length || 0) * 3;

    // Blogs with more comments get higher score
    score += (blog.comments?.length || 0) * 2;

    // Longer blogs (based on reading time) get slightly higher score
    if (blog.readingTime) {
      score += Math.min(blog.readingTime, 10); // Cap at 10 minutes
    }

    return score;
  };

  // Sort blogs by interest score
  const sortBlogsByInterest = (blogs) => {
    return [...blogs].sort((a, b) => {
      const scoreA = calculateInterestScore(a);
      const scoreB = calculateInterestScore(b);
      return scoreB - scoreA; // Descending order
    });
  };

  // Optimized data fetching
  const {
    data: responseData = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllBlogs({
    page,
    limit: blogsPerPage,
    search: searchTerm,
  });

  // Process new blogs and add to existing ones
  useEffect(() => {
    if (responseData?.data?.blogs) {
      const newBlogs = responseData.data.blogs;

      // Sort new blogs by interest before adding to the list
      const sortedNewBlogs = sortBlogsByInterest(newBlogs);

      setAllBlogs((prev) => {
        // Combine and deduplicate blogs
        const combined = [...prev, ...sortedNewBlogs];
        const uniqueBlogs = combined.reduce((acc, blog) => {
          if (!acc.some((b) => b._id === blog._id)) {
            acc.push(blog);
          }
          return acc;
        }, []);

        return uniqueBlogs;
      });

      setHasMore(responseData.data.pages > page);
      setIsFetching(false);
    }
  }, [responseData, page]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (isFetching || !hasMore) return;

    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const scrollThreshold = document.documentElement.offsetHeight - 500;

    if (scrollPosition >= scrollThreshold) {
      setIsFetching(true);
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reset when search term changes
  useEffect(() => {
    setAllBlogs([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

  const handleCreatePostClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  const handleNavigateToLogin = () => {
    setShowAuthModal(false);
    navigate("/login", { state: { from: "/blog/create" } });
  };

  // Clean up the debounce function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Show clear filters button when search is active
  const showClearSearch = inputValue !== "";

  // Pre-render UI elements to optimize rendering
  const headerContent = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <h1
        className={`text-3xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        } mb-4 md:mb-0`}>
        Blog Posts
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              className={`pl-10 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              value={inputValue}
              onChange={handleSearchChange}
            />
            <FaSearch
              className={`absolute left-3 top-3 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            {showClearSearch && (
              <button
                onClick={clearSearch}
                className={`absolute right-3 top-3 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>
        <Link
          to="/blog/create"
          onClick={handleCreatePostClick}
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
  );

  const loadingState = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(blogsPerPage)].map((_, i) => (
        <BlogCardSkeleton key={i} darkMode={darkMode} />
      ))}
    </div>
  );

  const loadingMoreState = (
    <div className="flex justify-center my-8">
      <FaSpinner className="animate-spin text-2xl text-blue-500" />
    </div>
  );

  const emptyState = (
    <div
      className={`text-center py-12 ${
        darkMode ? "text-gray-300" : "text-gray-600"
      }`}>
      <p className="text-lg mb-4">
        {searchTerm
          ? `No blogs found for "${searchTerm}"`
          : "No blog posts available yet"}
      </p>
      {searchTerm ? (
        <button
          onClick={clearSearch}
          className={`inline-block px-4 py-2 rounded-lg transition-colors ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}>
          Clear search
        </button>
      ) : (
        !currentUser && (
          <Link
            to="/blog/create"
            onClick={handleCreatePostClick}
            className={`inline-block px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            Create your first blog post
          </Link>
        )
      )}
    </div>
  );

  const blogGrid = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {allBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} darkMode={darkMode} />
        ))}
      </div>
      {isFetching && hasMore && loadingMoreState}
      {!hasMore && allBlogs.length > 0 && (
        <div
          className={`text-center py-6 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          You've reached the end of the list
        </div>
      )}
    </>
  );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {headerContent}

          {isError && (
            <ErrorMessage
              message={error?.message || "Failed to load blog posts"}
              darkMode={darkMode}
            />
          )}

          {isLoading && allBlogs.length === 0
            ? loadingState
            : allBlogs.length === 0
            ? emptyState
            : blogGrid}
        </div>
      </div>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Authentication Required"
        darkMode={darkMode}>
        <div className="space-y-6">
          <div className="flex items-start">
            <div
              className={`flex-shrink-0 p-2 rounded-full ${
                darkMode ? "bg-yellow-900/30" : "bg-yellow-100"
              }`}>
              <FaExclamationTriangle
                className={`h-6 w-6 ${
                  darkMode ? "text-yellow-400" : "text-yellow-600"
                }`}
              />
            </div>
            <div className="ml-4">
              <h3
                className={`text-lg font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                Sign in required
              </h3>
              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                You need to be logged in to create a blog post. Please sign in
                to continue.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAuthModal(false)}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${
                darkMode ? "text-white" : "text-gray-700"
              } transition-colors`}>
              Cancel
            </button>
            <button
              onClick={handleNavigateToLogin}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}>
              Sign in
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogPage;
