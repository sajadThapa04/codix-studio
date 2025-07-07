import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import GetBlogsByIdCard from "../../Components/Features/BlogCard/GetBlogsById/GetBlogsByIdCard";
import { useGetBlogById, useDeleteBlog } from "../../Hooks/Blog/blogHooks";
import { Modal, LoadingSpinner } from "../../Components/Ui";
import { useOutletContext } from "react-router-dom";

function DisplayBlogById() {
  const { darkMode } = useOutletContext();
  const { blogId } = useParams();
  const navigate = useNavigate();
  const deleteBlogMutation = useDeleteBlog();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.client.user);

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useGetBlogById(blogId);
  const blogData = data?.data || data;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setError(null);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteBlogMutation.mutateAsync(blogId);

      if (result?.success) {
        navigate("/blog");
      } else {
        setError(result?.message || "Failed to delete blog");
      }
    } catch (err) {
      setError(err.message || "Failed to delete blog");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`p-6 min-h-screen flex justify-center items-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}>
        <div className="max-w-md w-full px-4 text-center">
          <div
            className={`p-4 mb-4 rounded-lg ${
              darkMode
                ? "bg-red-900/30 text-red-300"
                : "bg-red-100 text-red-800"
            }`}>
            <h3 className="text-lg font-medium">Error loading blog post</h3>
            <p>{fetchError?.message || "Please try again later"}</p>
          </div>
          <button
            onClick={() => refetch()}
            className={`px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              darkMode ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
            }`}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!blogData?.id) {
    return (
      <div
        className={`p-6 min-h-screen flex justify-center items-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}>
        <div className="max-w-md w-full px-4 text-center">
          <div
            className={`p-4 mb-4 rounded-lg ${
              darkMode
                ? "bg-yellow-900/30 text-yellow-300"
                : "bg-yellow-100 text-yellow-800"
            }`}>
            <h3 className="text-lg font-medium">Blog post not found</h3>
            <p>We couldn't find the requested post.</p>
          </div>
          <button
            onClick={() => navigate("/blog")}
            className={`px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              darkMode ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
            }`}>
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <GetBlogsByIdCard
            blog={{
              ...blogData,
              isLiked: blogData?.likes?.includes(currentUser?._id) || false,
              likeCount: blogData?.likes?.length || 0,
            }}
            onBack={() => navigate("/blog")}
            onDelete={handleDeleteClick}
          />

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={cancelDelete}
            title="Confirm Deletion">
            <div className="space-y-4">
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Are you sure you want to delete this blog? This action cannot be
                undone.
              </p>

              {error && (
                <div
                  className={`p-3 rounded ${
                    darkMode
                      ? "bg-red-900/30 text-red-300"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded hover:bg-gray-200 disabled:opacity-50 ${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center ${
                    darkMode ? "bg-red-600 text-white" : "bg-red-600 text-white"
                  }`}>
                  {isDeleting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default DisplayBlogById;
