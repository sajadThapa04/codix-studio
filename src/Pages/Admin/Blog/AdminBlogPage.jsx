import React, { useState, useMemo } from "react";
import {
  useAdminBlogs,
  useUpdateBlogStatus,
  useToggleBlogFeatured,
  useDeleteBlog,
} from "../../../Hooks/admin/adminDashboard/adminDashboardHook";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AdminBlogCard from "../../../Components/Features/AdminCard/Blog/BlogCard";
import { Modal } from "../../../Components/Ui";

function AdminBlogPage() {
  const {
    data: blogsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminBlogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [localStatus, setLocalStatus] = useState("");
  const [localFeatured, setLocalFeatured] = useState(false);

  const itemsPerPage = 9;
  const { mutate: updateBlogStatus } = useUpdateBlogStatus({
    onSuccess: () => {
      refetch(); // Refetch blogs after status update
    },
  });
  const { mutate: toggleBlogFeatured } = useToggleBlogFeatured({
    onSuccess: () => {
      refetch(); // Refetch blogs after status update
    },
  });

  const { mutate: deleteBlogs } = useDeleteBlog();

  const blogs = useMemo(() => blogsData?.data?.blogs || [], [blogsData]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const title = blog.title || "";
      const content = blog.content || "";
      const tags = blog.tags?.join(" ") || "";
      const status = blog.status || "draft";
      const category = blog.category || "";
      const featured = blog.featured || false;

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tags.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" ||
        category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && featured) ||
        (featuredFilter === "regular" && !featured);

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesFeatured
      );
    });
  }, [blogs, searchTerm, statusFilter, categoryFilter, featuredFilter]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (value) => setCurrentPage(value);

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setLocalStatus(blog.status);
    setLocalFeatured(blog.featured);
  };

  const handleSaveChanges = async () => {
    if (!editingBlog) return;

    try {
      const promises = [];

      // Queue status update if changed
      if (localStatus !== editingBlog.status) {
        promises.push(
          updateBlogStatus({
            id: editingBlog._id,
            status: localStatus,
          })
        );
      }

      // Queue featured toggle if changed
      if (localFeatured !== editingBlog.featured) {
        promises.push(toggleBlogFeatured(editingBlog._id));
      }

      // Execute all updates in parallel
      await Promise.all(promises);

      setEditingBlog(null);
    } catch (error) {
      console.error("Error updating blog:", error);
      // Reset to original values on error
      setLocalStatus(editingBlog.status);
      setLocalFeatured(editingBlog.featured);
    }
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setLocalStatus("");
    setLocalFeatured(false);
  };

  const handleDeleteBlog = (blog) => {
    setBlogToDelete(blog);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      deleteBlogs(blogToDelete.id || blogToDelete._id);
      console.log("Deleting blog:", blogToDelete);
      setBlogToDelete(null);
    }
  };

  const cancelDelete = () => {
    setBlogToDelete(null);
  };

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    blogs.forEach((blog) => {
      if (blog.category) {
        uniqueCategories.add(blog.category.toLowerCase());
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [blogs]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          Error loading blogs: {error.message || "Unknown error occurred"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-[#101418] dark:text-gray-200 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <h1 className="text-[32px] font-bold leading-tight min-w-72">
          Blog Management
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="all">All Posts</option>
            <option value="featured">Featured Only</option>
            <option value="regular">Regular Only</option>
          </select>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingBlog}
        onClose={handleCancelEdit}
        title={`Edit Blog: ${editingBlog?.title || ""}`}
        className="max-w-md dark:bg-gray-800">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFeatured}
                onChange={(e) => setLocalFeatured(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Post
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 transition-colors duration-200">
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={
                updateBlogStatus.isPending || toggleBlogFeatured.isPending
              }
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md shadow-sm transition-colors duration-200">
              {updateBlogStatus.isPending || toggleBlogFeatured.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!blogToDelete}
        onClose={cancelDelete}
        title="Confirm Deletion"
        className="max-w-md dark:bg-gray-800">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete the blog post{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              "{blogToDelete?.title || "Untitled"}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 transition-colors duration-200">
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-md shadow-sm transition-colors duration-200">
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Blogs Table */}
      {filteredBlogs.length === 0 ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {blogs.length === 0
              ? "No blogs available"
              : "No blogs found matching your criteria"}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#d4dbe2] dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[120px]">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[100px]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[80px]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[120px]">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[100px]">
                    Dates
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[80px]">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[80px]">
                    Actions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedBlogs.map((blog) => (
                  <AdminBlogCard
                    key={blog.id || blog._id}
                    blog={blog}
                    onEdit={handleEditBlog}
                    onDelete={handleDeleteBlog}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === page
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900"
                          : "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}>
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminBlogPage;
