import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreateBlogCard from "../../Components/Features/BlogCard/CreateBlog/CreateBlogCard";
import { useCreateBlog } from "../../Hooks/Blog/blogHooks";

function CreateBlog() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    show: false,
    type: "", // 'success' | 'error'
    message: "",
    timeout: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mutate: createBlog,
    isLoading,
    isError,
    error,
    isSuccess,
    data: createdBlog,
  } = useCreateBlog();

  const closeNotification = () => {
    if (notification.timeout) {
      clearTimeout(notification.timeout);
    }
    setNotification({ show: false, type: "", message: "", timeout: null });
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        if (createdBlog?._id) {
          navigate(`/blog/${createdBlog._id}`);
        } else {
          navigate("/blogs");
        }
      }, 2500);

      setNotification({
        show: true,
        type: "success",
        message: "Blog created successfully! Redirecting...",
        timeout: timer,
      });
      setIsSubmitting(false);
    }

    if (isError) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to create blog. Please try again.";

      setNotification({
        show: true,
        type: "error",
        message: errorMessage,
        timeout: setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
        }, 5000),
      });
      setIsSubmitting(false);
    }

    return () => {
      if (notification.timeout) {
        clearTimeout(notification.timeout);
      }
    };
  }, [isSuccess, isError, error, createdBlog, navigate]);

  const handleSubmit = async (blogData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append all fields except tags and image first
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      formData.append("category", blogData.category);
      formData.append("status", blogData.status);
      formData.append("featured", blogData.featured);
      formData.append("seoTitle", blogData.seoTitle || blogData.title);
      formData.append("seoDescription", blogData.seoDescription || "");
      formData.append("metaKeywords", blogData.metaKeywords || "");
      formData.append("altText", blogData.altText || "");

      // Handle tags - append each tag individually
      if (Array.isArray(blogData.tags)) {
        blogData.tags.forEach((tag) => {
          if (tag.trim()) {
            // Only append non-empty tags
            formData.append("tags", tag.trim());
          }
        });
      }

      // Debug logs
      console.log("Tags being sent:", blogData.tags);
      console.log("FormData tags:", formData.getAll("tags"));

      // Append image if it exists
      if (blogData.imageFile) {
        formData.append("coverImage", blogData.imageFile);
      }

      await createBlog(formData);
    } catch (err) {
      console.error("Submission error:", err);
      setNotification({
        show: true,
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
        timeout: setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
        }, 5000),
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="max-w-5xl mx-auto">
        <CreateBlogCard
          onSubmit={handleSubmit}
          isLoading={isLoading || isSubmitting}
        />
      </div>

      {/* Centered Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none`}>
            <div
              className={`max-w-md w-full mx-4 p-4 rounded-lg shadow-lg pointer-events-auto ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 ${
                    notification.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}>
                  {notification.type === "success" ? (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      notification.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}>
                    {notification.type === "success" ? "Success!" : "Error!"}
                  </h3>
                  <div className="mt-1 text-sm">
                    <p>{notification.message}</p>
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={closeNotification}
                      className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 ${
                        notification.type === "success"
                          ? "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50"
                          : "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50"
                      }`}>
                      <span className="sr-only">Dismiss</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateBlog;
