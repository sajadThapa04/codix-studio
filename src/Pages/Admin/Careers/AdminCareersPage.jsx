import React, { useState } from "react";
import { useGetAllCareerApplications } from "../../../Hooks/career/careerHooks";
import {
  useUpdateApplicationStatus,
  useDeleteCareerApplication,
} from "../../../Hooks/career/careerHooks";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import AdminCareersCard from "../../../Components/Features/AdminCard/Careers/AdminCareersCard";
import { Modal } from "../../../Components/Ui";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "Applied", label: "Applied" },
  { value: "Under Review", label: "Under Review" },
  { value: "Interview", label: "Interview" },
  { value: "Hired", label: "Hired" },
  { value: "Rejected", label: "Rejected" },
];

const sourceOptions = [
  { value: "", label: "All Sources" },
  { value: "Website", label: "Website" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Referral", label: "Referral" },
  { value: "Job Fair", label: "Job Fair" },
  { value: "Other", label: "Other" },
];

function AdminCareersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    source: "",
    search: "",
  });
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [editingApplication, setEditingApplication] = useState(null);
  const [localStatus, setLocalStatus] = useState("");

  // Fetch applications
  const {
    data: applicationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllCareerApplications(filters);

  // Mutation hooks
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { mutate: deleteApplication } = useDeleteCareerApplication();

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleStatusFilter = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleSourceFilter = (e) => {
    setFilters((prev) => ({ ...prev, source: e.target.value, page: 1 }));
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setLocalStatus(application.status);
  };

  const handleSaveStatus = () => {
    if (!editingApplication) return;

    updateStatus(
      {
        applicationId: editingApplication._id,
        statusData: { status: localStatus },
      },
      {
        onSuccess: () => {
          refetch();
          setEditingApplication(null);
        },
        onError: (error) => {
          console.error("Failed to update status:", error);
        },
      }
    );
  };

  const handleDeleteApplication = (application) => {
    setApplicationToDelete(application);
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      deleteApplication(applicationToDelete._id, {
        onSuccess: () => {
          refetch();
          setApplicationToDelete(null);
        },
        onError: (error) => {
          console.error("Failed to delete application:", error);
        },
      });
    }
  };

  const cancelDelete = () => {
    setApplicationToDelete(null);
  };

  const cancelEdit = () => {
    setEditingApplication(null);
  };

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
          Error loading applications:{" "}
          {error.message || "Unknown error occurred"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-[#101418] dark:text-gray-200 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <h1 className="text-2xl font-bold leading-tight min-w-72">
          Career Applications
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
            placeholder="Search applications..."
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={filters.status}
            onChange={handleStatusFilter}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={filters.source}
            onChange={handleSourceFilter}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Edit Status Modal */}
      <Modal
        isOpen={!!editingApplication}
        onClose={cancelEdit}
        title={`Update Application Status - ${
          editingApplication?.fullName || ""
        }`}
        className="max-w-md dark:bg-gray-800">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              {statusOptions
                .filter((opt) => opt.value)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 transition-colors duration-200">
              Cancel
            </button>
            <button
              onClick={handleSaveStatus}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md shadow-sm transition-colors duration-200">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!applicationToDelete}
        onClose={cancelDelete}
        title="Confirm Deletion"
        className="max-w-md dark:bg-gray-800">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete the application from{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {applicationToDelete?.fullName}
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

      {/* Applications Table */}
      {applicationsData?.applications?.length === 0 ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No applications found
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#d4dbe2] dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {applicationsData?.data?.applications?.map((application) => (
                  <AdminCareersCard
                    key={application._id}
                    application={application}
                    onEdit={handleEditApplication}
                    onDelete={handleDeleteApplication}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {applicationsData?.pages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, filters.page - 1))
                  }
                  disabled={filters.page === 1}
                  className="px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
                  Previous
                </button>
                {Array.from(
                  { length: applicationsData.pages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      filters.page === page
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900"
                        : "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}>
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(applicationsData.pages, filters.page + 1)
                    )
                  }
                  disabled={filters.page === applicationsData.pages}
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

export default AdminCareersPage;
