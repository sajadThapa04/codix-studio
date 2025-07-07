import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { likeBlog } from "../../../../Stores/Slices/blog.slices";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEye,
  FiClock,
  FiImage,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { Modal } from "../../../Ui";
import { useOutletContext } from "react-router-dom";

function GetBlogsByIdCard({ blog, onBack, onDelete }) {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.client.user);

  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(blog?.isLiked || false);
  const [likeCount, setLikeCount] = useState(blog?.likeCount || 0);
  const [profileImageError, setProfileImageError] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);

  const contentRef = useRef(null);
  const contentContainerRef = useRef(null);

  const isAuthor = currentUser?._id === blog?.author?._id;

  const handleEdit = () => {
    if (!blog?.id) return;
    navigate(`/blog/${blog.id}/edit`);
  };

  useEffect(() => {
    if (contentRef.current && contentContainerRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const containerHeight = contentContainerRef.current.clientHeight;
      setShowToggle(contentHeight > containerHeight);
    }
  }, [blog?.content]);

  // Safe access to nested properties
  const coverImageUrl = blog?.coverImage?.url;
  const coverImageAlt = blog?.coverImage?.altText || "Blog cover image";
  const authorName = blog?.author?.fullName || "Unknown Author";
  const profileImage = blog?.author?.profileImage;
  const initials = authorName.charAt(0);
  const category = blog?.category || "Uncategorized";
  const tags = blog?.tags || [];
  const content = blog?.content || "";
  const createdAt = blog?.createdAt ? new Date(blog.createdAt) : new Date();
  const readingTime = blog?.readingTime || "Unknown reading time";
  const views = blog?.views || 0;
  const featured = blog?.featured || false;
  const status = blog?.status || "unknown";

  const cleanContent = (content) => {
    if (!content) return "";
    const paragraphs = content.split("\n");
    const uniqueParagraphs = [];
    const seen = new Set();

    paragraphs.forEach((para) => {
      const trimmed = para.trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        uniqueParagraphs.push(para);
      }
    });

    return uniqueParagraphs.join("\n");
  };

  const cleanedContent = cleanContent(content);

  const getTagColor = (tagText) => {
    if (!tagText)
      return darkMode
        ? "bg-blue-900/30 text-blue-300"
        : "bg-blue-100 text-blue-800";
    const hash = tagText
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = darkMode
      ? [
          "bg-pink-900/30 text-pink-300",
          "bg-red-900/30 text-red-300",
          "bg-orange-900/30 text-orange-300",
          "bg-yellow-900/30 text-yellow-300",
          "bg-green-900/30 text-green-300",
          "bg-teal-900/30 text-teal-300",
          "bg-blue-900/30 text-blue-300",
          "bg-indigo-900/30 text-indigo-300",
          "bg-purple-900/30 text-purple-300",
        ]
      : [
          "bg-pink-100 text-pink-800",
          "bg-red-100 text-red-800",
          "bg-orange-100 text-orange-800",
          "bg-yellow-100 text-yellow-800",
          "bg-green-100 text-green-800",
          "bg-teal-100 text-teal-800",
          "bg-blue-100 text-blue-800",
          "bg-indigo-100 text-indigo-800",
          "bg-purple-100 text-purple-800",
        ];
    return colors[hash % colors.length];
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const handleLike = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!blog?.id || isProcessingLike) return;

    setIsProcessingLike(true);
    const newLikeStatus = !isLiked;

    // Optimistic UI update
    setIsLiked(newLikeStatus);
    setLikeCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));

    try {
      const result = await dispatch(likeBlog(blog.id)).unwrap();

      if (result.success) {
        // Update state based on actual backend response
        const currentUserLiked =
          result.data?.likes?.includes(currentUser._id) || false;
        setIsLiked(currentUserLiked);
        setLikeCount(result.data?.likes?.length || 0);
      } else {
        // Revert if the API call failed
        setIsLiked(!newLikeStatus);
        setLikeCount((prev) => (newLikeStatus ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Like error:", error);
      // Revert on error
      setIsLiked(!newLikeStatus);
      setLikeCount((prev) => (newLikeStatus ? prev - 1 : prev + 1));
    } finally {
      setIsProcessingLike(false);
    }
  };

  if (!blog) {
    return (
      <div
        className={`p-6 text-center ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div
          className={`p-4 rounded-lg mb-4 ${
            darkMode
              ? "bg-yellow-900/30 text-yellow-300"
              : "bg-yellow-100 text-yellow-800"
          }`}>
          <p className="font-bold">Blog data not available</p>
          <p>The blog content could not be loaded.</p>
        </div>
        <button
          onClick={onBack}
          className={`px-4 py-2 rounded-lg mt-4 ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}>
          Back to all articles
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl mx-auto font-sans px-4 sm:px-6 py-6 ${
        darkMode ? "text-gray-100" : "text-gray-900"
      }`}>
      {/* Back button with improved mobile spacing */}
      <button
        onClick={onBack}
        className={`flex items-center gap-2 mb-6 px-4 py-3 rounded-lg transition-colors ${
          darkMode
            ? "text-blue-400 hover:text-blue-300"
            : "text-blue-600 hover:text-blue-800"
        }`}>
        <FiArrowLeft className="text-xl" />
        <span className="text-base font-medium">Back to all articles</span>
      </button>

      {/* Main card container */}
      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
        {/* Cover image */}
        {coverImageUrl && !imageError ? (
          <img
            src={`${coverImageUrl}?${Date.now()}`}
            alt={coverImageAlt}
            className="w-full h-64 sm:h-80 object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div
            className={`w-full h-64 sm:h-80 flex items-center justify-center ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
            <FiImage
              className={`text-4xl ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>
        )}

        {/* Content section with improved mobile padding */}
        <div className="p-4 sm:p-6">
          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <span
              className={`px-3 py-1 rounded-md text-sm font-semibold uppercase truncate max-w-[150px] ${
                darkMode
                  ? "bg-blue-900/30 text-blue-300"
                  : "bg-blue-100 text-blue-800"
              }`}>
              {category}
            </span>
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded-md text-sm font-medium ${getTagColor(
                  tag
                )}`}>
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Title with improved mobile sizing */}
          <motion.div whileHover={{ x: 3 }} className="mb-4 sm:mb-5">
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
              {blog.title || "Untitled Blog Post"}
            </h1>
          </motion.div>

          {/* Author and metadata row */}
          <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
            <div className="flex items-center">
              {profileImage && !profileImageError ? (
                <img
                  src={profileImage}
                  alt={authorName}
                  onError={() => setProfileImageError(true)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3"
                />
              ) : (
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
                    darkMode ? "bg-indigo-600" : "bg-indigo-500"
                  } text-white`}>
                  {initials}
                </div>
              )}
              <span
                className={`font-medium text-sm sm:text-base ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                {authorName}
              </span>
            </div>
            <span
              className={`hidden md:block text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              {createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span
              className={`text-xs sm:text-sm flex items-center ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              <FiClock className="mr-1" />
              {readingTime}
            </span>
          </div>

          {/* Mobile-only date */}
          <div
            className={`md:hidden text-xs sm:text-sm mb-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
            {createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Divider */}
          <div
            className={`border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } my-4 sm:my-6 md:my-8`}></div>

          {/* Content with show more/less */}
          <div
            ref={contentContainerRef}
            className={`relative ${
              expanded ? "" : "max-h-96 sm:max-h-[400px]"
            } overflow-hidden`}>
            <div ref={contentRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                {cleanedContent.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-3 sm:mb-4">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            </div>

            {!expanded && showToggle && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-b from-transparent ${
                  darkMode ? "to-gray-800" : "to-white"
                } flex items-end justify-center pb-4 sm:pb-5`}>
                <button
                  onClick={() => setExpanded(true)}
                  className={`flex items-center gap-1 font-medium text-sm sm:text-base ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                  <span>Show More</span>
                  <FiChevronDown />
                </button>
              </div>
            )}
          </div>

          {expanded && showToggle && (
            <div className="text-center mt-4">
              <button
                onClick={() => setExpanded(false)}
                className={`flex items-center gap-1 font-medium text-sm sm:text-base mx-auto ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}>
                <span>Show Less</span>
                <FiChevronUp />
              </button>
            </div>
          )}

          {/* Divider */}
          <div
            className={`border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } mt-6 sm:mt-8 mb-4 sm:mb-6`}></div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleLike}
                disabled={isProcessingLike}
                className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors ${
                  isLiked
                    ? darkMode
                      ? "text-blue-400"
                      : "text-blue-500"
                    : darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
                } ${isProcessingLike ? "cursor-not-allowed opacity-80" : ""}`}>
                {isLiked ? (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}>
                    <FaHeart
                      className={darkMode ? "text-blue-400" : "text-blue-500"}
                    />
                  </motion.div>
                ) : (
                  <FaRegHeart />
                )}
                <span className="text-xs sm:text-sm">{likeCount} Likes</span>
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                <FiEye />
                <span className="text-xs sm:text-sm">{views} Views</span>
              </button>
              {isAuthor && (
                <>
                  <button
                    onClick={handleEdit}
                    className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white text-xs sm:text-sm`}>
                    <FiEdit2 />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={onDelete}
                    className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white text-xs sm:text-sm`}>
                    <FiTrash2 />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {featured && (
                <span
                  className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-semibold ${
                    darkMode
                      ? "bg-yellow-900/30 text-yellow-300"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                  <FaStar className="text-xs sm:text-sm" />
                  <span>Featured</span>
                </span>
              )}
              <span
                className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-semibold ${
                  status === "published"
                    ? darkMode
                      ? "bg-green-900/30 text-green-300"
                      : "bg-green-100 text-green-800"
                    : darkMode
                    ? "bg-orange-900/30 text-orange-300"
                    : "bg-orange-100 text-orange-800"
                }`}>
                {status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Authentication Required"
        darkMode={darkMode}>
        <div className="space-y-4">
          <p className={darkMode ? "text-black" : "text-gray-700"}>
            You need to be logged in to like this blog post.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAuthModal(false)}
              className={`px-4 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Cancel
            </button>
            <button
              onClick={() => {
                setShowAuthModal(false);
                navigate("/login");
              }}
              className={`px-4 py-2 text-white rounded hover:bg-blue-700 ${
                darkMode ? "bg-blue-600" : "bg-blue-600"
              }`}>
              Login
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

export default GetBlogsByIdCard;
