// src/Components/Features/AdminCard/Contacts/AdminContactsCard.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const AdminContactsCard = ({
  contacts = [],
  total = 0,
  pages = 1,
  currentPage = 1,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const [expandedContact, setExpandedContact] = useState(null);

  const toggleExpand = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  const statusBadge = (status) => {
    const classes = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      resolved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          classes[status.toLowerCase()] || classes.pending
        }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {contacts.map((contact) => (
            <React.Fragment key={contact._id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contact.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {contact.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {statusBadge(contact.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(contact)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      aria-label={`Edit ${contact.fullName}`}>
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(contact)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500"
                      aria-label={`Delete ${contact.fullName}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => toggleExpand(contact._id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label={`${
                        expandedContact === contact._id ? "Collapse" : "Expand"
                      } details`}>
                      {expandedContact === contact._id ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
              {expandedContact === contact._id && (
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan="5" className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Full Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                          {contact.fullName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                          {contact.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Phone
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                          {contact.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Country
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                          {contact.country || "N/A"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Original Message
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-200 whitespace-pre-wrap">
                          {contact.message || "N/A"}
                        </p>
                      </div>
                      {contact.responseMessage && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Response Message
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-200 whitespace-pre-wrap">
                            {contact.responseMessage}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Created At
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                          {new Date(contact.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Last Updated
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                          {new Date(contact.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(currentPage * 10, total)}
          </span>{" "}
          of <span className="font-medium">{total}</span> contacts
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= pages}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

AdminContactsCard.propTypes = {
  contacts: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AdminContactsCard;
