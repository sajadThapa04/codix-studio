import React from "react";
import {
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { FiExternalLink } from "react-icons/fi";
const AdminCareersCard = ({ application, onEdit, onDelete }) => {
  const {
    fullName,
    email,
    phone,
    positionApplied,
    resume,
    status,
    source,
    createdAt,
  } = application;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Status colors for light and dark mode
  const statusColors = {
    Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
    "Under Review":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-400",
    Interview:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400",
    Hired: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400",
  };

  // Source colors
  const sourceColors = {
    Website: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    LinkedIn: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
    Referral:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400",
    "Job Fair":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-400",
    Other:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400",
  };

  return (
    <tr className="border-t border-t-[#d4dbe2] dark:border-t-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="h-[72px] px-4 py-2 w-[200px] text-[#101418] dark:text-gray-200 text-sm font-normal leading-normal">
        {fullName}
      </td>
      <td className="h-[72px] px-4 py-2 w-[250px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {email}
      </td>
      <td className="h-[72px] px-4 py-2 w-[150px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {phone}
      </td>
      <td className="h-[72px] px-4 py-2 w-[200px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {positionApplied}
      </td>
      <td className="h-[72px] px-4 py-2 w-[150px] text-[#5c728a] dark:text-gray-400 text-sm font-normal leading-normal">
        {formattedDate}
      </td>
      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <button
          className={`flex min-w-[84px] max-w-[480px] cursor-default items-center justify-center overflow-hidden rounded-full h-8 px-4 text-sm font-medium leading-normal w-full ${
            statusColors[status] || statusColors.Applied
          }`}>
          <span className="truncate">{status}</span>
        </button>
      </td>
      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <button
          className={`flex min-w-[84px] max-w-[480px] cursor-default items-center justify-center overflow-hidden rounded-full h-8 px-4 text-sm font-medium leading-normal w-full ${
            sourceColors[source] || sourceColors.Website
          }`}>
          <span className="truncate">{source}</span>
        </button>
      </td>
      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <a
          href={resume.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
          <DocumentTextIcon className="h-5 w-5" />
          <span>View</span>
          <FiExternalLink className="h-4 w-4" />
        </a>
      </td>
      {/* Action Buttons */}
      <td className="h-[72px] px-4 py-2 w-40 text-sm font-normal leading-normal">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(application)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md"
            title="Edit">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(application)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
            title="Delete">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

AdminCareersCard.defaultProps = {
  application: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    positionApplied: "Software Engineer",
    resume: {
      url: "https://example.com/resume.pdf",
      publicId: "resume123",
    },
    status: "Applied",
    source: "Website",
    createdAt: new Date(),
  },
  onEdit: () => {},
  onDelete: () => {},
};

export default AdminCareersCard;
