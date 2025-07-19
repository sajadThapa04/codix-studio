// src/Pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import ContactsCard from "../../Components/Features/AdminCard/Contacts/ContactsCard";
import {
  useGetAllContacts,
  useUpdateContact,
  useDeleteContact,
} from "../../Hooks/Contact/contactHooks";
import { useOutletContext } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Modal } from "../../Components/Ui";

function AdminDashboard() {
  const { darkMode, toggleDarkMode } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [localStatus, setLocalStatus] = useState("");
  const [localResponse, setLocalResponse] = useState("");

  const { mutate: updateContact } = useUpdateContact();
  const { mutate: deleteContact } = useDeleteContact();

  // Memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setSearchQuery(query);
        setCurrentPage(1);
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
    setSearchQuery("");
  };

  // Fetch contacts using the hook
  const {
    data: apiResponse = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllContacts({
    status: statusFilter,
    search: searchQuery,
    page: currentPage,
    limit: 10,
  });

  // Extract the nested data
  const contactsData = apiResponse.data || {
    contacts: [],
    total: 0,
    pages: 1,
    currentPage: 1,
  };

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setLocalStatus(contact.status);
    setLocalResponse(contact.responseMessage || "");
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete._id, {
        onSuccess: () => {
          refetch();
          setContactToDelete(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setContactToDelete(null);
  };

  // In your AdminDashboard.jsx, update the handleSaveChanges function:
  const handleSaveChanges = () => {
    if (!editingContact) return;

    updateContact(
      {
        contactId: editingContact._id, // Changed from 'id' to 'contactId' to match the hook
        updateData: {
          status: localStatus,
          responseMessage: localResponse,
        },
      },
      {
        onSuccess: () => {
          refetch();
          setEditingContact(null);
        },
        onError: (error) => {
          console.error("Failed to update contact:", error);
          // You might want to show an error message to the user here
        },
      }
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    clearSearch();
    setCurrentPage(1);
  };

  // Show clear filters button when filters are active
  const showClearFilters = statusFilter !== "all" || searchQuery !== "";

  if (isLoading) {
    return (
      <div className={`p-6 ${darkMode ? "dark" : ""}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`p-6 ${darkMode ? "dark" : ""}`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-100 dark:border-red-700">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {error?.message || "Failed to load contacts"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? "dark" : ""}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact Management
        </h1>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2">
          {darkMode ? (
            <>
              <span>🌞</span> Light Mode
            </>
          ) : (
            <>
              <span>🌙</span> Dark Mode
            </>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          {/* Status Filter */}
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-3 pr-8 py-2">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Contacts
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or subject..."
                value={inputValue}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {inputValue && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {showClearFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 flex items-center gap-1 h-[42px]">
              <XMarkIcon className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Contacts Table */}
        {contactsData?.contacts?.length > 0 ? (
          <ContactsCard
            contacts={contactsData.contacts}
            total={contactsData.total}
            pages={contactsData.pages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No contacts found {searchQuery ? `for "${searchQuery}"` : ""}
              {statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}
            </p>
            {showClearFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 flex items-center gap-1 mx-auto">
                <XMarkIcon className="h-4 w-4" />
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Contact Modal */}
      <Modal
        isOpen={!!editingContact}
        onClose={() => setEditingContact(null)}
        title={`Edit Contact: ${editingContact?.fullName || ""}`}
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
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Response Message
            </label>
            <textarea
              value={localResponse}
              onChange={(e) => setLocalResponse(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              rows={4}
              placeholder="Enter your response message..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setEditingContact(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 transition-colors duration-200">
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md shadow-sm transition-colors duration-200">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!contactToDelete}
        onClose={cancelDelete}
        title="Confirm Deletion"
        className="max-w-md dark:bg-gray-800">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete the contact for{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {contactToDelete?.fullName || "this contact"}
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
    </div>
  );
}

export default AdminDashboard;
