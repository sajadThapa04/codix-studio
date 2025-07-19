import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

const statusBadge = (status) => {
  const classes = {
    published:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    draft:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
        classes[status.toLowerCase()] || classes.draft
      }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const BlogDetailsRow = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-300">
        {Array.isArray(value) ? (
          <ul className="list-disc pl-5 space-y-1">
            {value.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : typeof value === "boolean" ? (
          value ? (
            "Yes"
          ) : (
            "No"
          )
        ) : (
          value
        )}
      </dd>
    </div>
  );
};

const AdminBlogCard = ({ blog, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    title,
    content,
    author,
    status,
    category,
    featured,
    tags = [],
    createdAt,
    updatedAt,
    coverImage,
    likes = [],
    views,
    readingTime,
  } = blog;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <React.Fragment>
      <tr className="border-t border-t-[#d4dbe2] dark:border-t-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
        {/* Author */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
          {author?.fullName || "Unknown Author"}
        </td>

        {/* Category */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {category || "Uncategorized"}
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {statusBadge(status)}
        </td>

        {/* Tags */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{tags.length - 2}
              </span>
            )}
          </div>
        </td>

        {/* Dates */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {formatDate(createdAt)}
        </td>

        {/* Featured */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {featured ? (
            <span className="text-green-500 dark:text-green-400">Yes</span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">No</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button
            onClick={() => onEdit(blog)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500"
            aria-label={`Edit ${title}`}>
            <PencilIcon className="h-5 w-5 inline" />
          </button>
          <button
            onClick={() => onDelete(blog)}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
            aria-label={`Delete ${title}`}>
            <TrashIcon className="h-5 w-5 inline" />
          </button>
        </td>

        {/* Details Toggle */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={toggleExpand}
            aria-label={
              expanded
                ? `Collapse details for ${title}`
                : `Expand details for ${title}`
            }
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none">
            {expanded ? (
              <ChevronUpIcon className="h-5 w-5 inline" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 inline" />
            )}
          </button>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {expanded && (
        <tr>
          <td colSpan={8} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Blog Content
                </h3>
                <dl className="divide-y divide-gray-200 dark:divide-gray-600">
                  <BlogDetailsRow label="Title" value={title} />
                  <div className="py-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 pb-2">
                      Content
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-300">
                      <div className="max-h-60 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                        {content}
                      </div>
                    </dd>
                  </div>
                  <BlogDetailsRow label="Likes" value={likes.length} />
                  <BlogDetailsRow label="Views" value={views} />
                  <BlogDetailsRow label="Reading Time" value={readingTime} />
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Metadata
                </h3>
                <dl className="divide-y divide-gray-200 dark:divide-gray-600">
                  <BlogDetailsRow
                    label="Created At"
                    value={new Date(createdAt).toLocaleString()}
                  />
                  <BlogDetailsRow
                    label="Updated At"
                    value={new Date(updatedAt).toLocaleString()}
                  />
                  <BlogDetailsRow label="All Tags" value={tags} />
                </dl>
                {coverImage?.url && (
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Cover Image
                    </h4>
                    <button
                      onClick={() => setSelectedImage(coverImage.url)}
                      aria-label={`View cover image for ${title}`}
                      className="focus:outline-none rounded-md overflow-hidden shadow-sm hover:opacity-90 transition-opacity">
                      <img
                        src={coverImage.url}
                        alt={coverImage.altText || "Blog cover"}
                        className="h-32 w-full object-cover rounded-md"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close image modal">
              <XMarkIcon className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged blog cover"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default AdminBlogCard;
