import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../../../Ui";

const statusBadge = (status) => {
  const classes = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    draft:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        classes[status.toLowerCase()] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ServiceDetailsRow = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-300">
        {Array.isArray(value) ? (
          <ul className="list-disc pl-5">
            {value.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : typeof value === "boolean" ? (
          value.toString()
        ) : (
          value
        )}
      </dd>
    </div>
  );
};

const ManageService = ({
  services = {},
  onEdit,
  onDelete,
  onRefresh,
  isLoading,
  hasLoadedInitialServices,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Safely extract services array from the nested structure
  const servicesArray = services?.services || [];
  const pagination = services?.pagination || {};

  if (!hasLoadedInitialServices) {
    return (
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="md" text="Loading services..." />
        </div>
      </div>
    );
  }

  if (servicesArray.length === 0) {
    return (
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No services found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {hasLoadedInitialServices
              ? "Create your first service to get started"
              : "Loading services..."}
          </p>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4" />
                Refresh Services
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <XMarkIcon className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged service thumbnail"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Manage Services
            </h1>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              <ArrowPathIcon
                className={`-ml-0.5 mr-2 h-4 w-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {servicesArray.map((service) => (
                  <React.Fragment key={service._id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {service.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {service.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${service.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {statusBadge(service.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => onEdit(service._id)}
                          disabled={isLoading}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-4 disabled:opacity-50 disabled:cursor-not-allowed">
                          <PencilIcon className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => onDelete(service._id)}
                          disabled={isLoading}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => toggleRow(service._id)}
                          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          {expandedRows[service._id] ? (
                            <ChevronUpIcon className="h-5 w-5 inline" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 inline" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedRows[service._id] && (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Service Details
                              </h3>
                              <dl className="divide-y divide-gray-200 dark:divide-gray-600">
                                <ServiceDetailsRow
                                  label="Description"
                                  value={service.description}
                                />
                                <ServiceDetailsRow
                                  label="Delivery Time"
                                  value={`${service.deliveryTimeInDays} days`}
                                />
                                <ServiceDetailsRow
                                  label="Customizable"
                                  value={service.isCustomizable}
                                />
                                <ServiceDetailsRow
                                  label="Created At"
                                  value={new Date(
                                    service.createdAt
                                  ).toLocaleString()}
                                />
                                <ServiceDetailsRow
                                  label="Updated At"
                                  value={new Date(
                                    service.updatedAt
                                  ).toLocaleString()}
                                />
                              </dl>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Features & Tags
                              </h3>
                              <dl className="divide-y divide-gray-200 dark:divide-gray-600">
                                <ServiceDetailsRow
                                  label="Features"
                                  value={service.features}
                                />
                                <ServiceDetailsRow
                                  label="Tags"
                                  value={service.tags}
                                />
                              </dl>
                              {service.thumbnail && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Thumbnail
                                  </h4>
                                  <button
                                    onClick={() =>
                                      setSelectedImage(service.thumbnail)
                                    }
                                    className="focus:outline-none">
                                    <img
                                      src={service.thumbnail}
                                      alt="Service thumbnail"
                                      className="h-32 w-32 object-cover rounded-md hover:opacity-90 transition-opacity"
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageService;
