import React, { useState } from "react";
import { useGetActiveServices } from "../../Hooks/Services/serviceHooks";
import FrontendServiceCard from "../../Components/Features/AdminCard/Services/FrontendServiceCard";
import FrontendClientRequestCard from "../../Components/Features/AdminCard/Services/FrontendClientRequestCard";
import { useCreateServiceRequest } from "../../Hooks/client/clientRequestFormHooks";
import { ExclamationTriangleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner, Modal, SuccessMessage } from "../../Components/Ui";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../Stores/Slices/client.slices";
import { motion } from "framer-motion";

function FrontendServicePage() {
  const { darkMode } = useOutletContext();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const createRequestMutation = useCreateServiceRequest();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  // Fetch active services with default filters
  const {
    data: servicesData,
    isLoading,
    isError,
    error,
  } = useGetActiveServices({
    page: 1,
    limit: 9,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const services = servicesData?.services || [];
  const pagination = servicesData?.pagination || {};

  const handleCreateRequest = async (formData) => {
    try {
      await createRequestMutation.mutateAsync(formData);
      setShowRequestForm(false);
      setSuccessMessage(
        "Your service request has been submitted successfully! We'll contact you soon."
      );
      setShowSuccess(true);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error creating service request:", error);
      setSuccessMessage("Failed to submit your request. Please try again.");
      setShowSuccess(true);
    }
  };

  const handleRequestButtonClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setShowRequestForm(!showRequestForm);
  };

  const handleNavigateToLogin = () => {
    setShowAuthModal(false);
    navigate("/login", { state: { from: "/services" } });
  };

  if (isLoading) {
    return (
      <div
        className={`flex justify-center items-center min-h-[300px] ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}>
        <LoadingSpinner size="lg" />
        <span
          className={`ml-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Loading services...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`rounded-md ${
          darkMode ? "bg-red-900/30" : "bg-red-50"
        } p-4 my-6`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3
              className={`text-sm font-medium ${
                darkMode ? "text-red-300" : "text-red-800"
              }`}>
              Error loading services
            </h3>
            <div
              className={`mt-2 text-sm ${
                darkMode ? "text-red-200" : "text-red-700"
              }`}>
              {error?.message ||
                "Failed to fetch services. Please try again later."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Success Message - Animated and Fixed Position */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full">
          <SuccessMessage
            message={successMessage}
            onDismiss={() => setShowSuccess(false)}
            className={`${
              darkMode
                ? "bg-green-900 border-green-700"
                : "bg-green-50 border-green-200"
            } border shadow-lg`}
          />
        </motion.div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-3xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            } sm:text-4xl`}>
            Our Services
          </h1>
          <p
            className={`mt-4 text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            Professional solutions tailored to your needs
          </p>
        </div>

        {/* Service Request Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleRequestButtonClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors`}>
            <PlusIcon className="h-5 w-5" />
            {showRequestForm ? "Hide Request Form" : "Request a Service"}
          </button>
        </div>

        {/* Service Request Form */}
        {showRequestForm && currentUser && (
          <div className="mb-12">
            <FrontendClientRequestCard
              onSubmit={handleCreateRequest}
              onCancel={() => setShowRequestForm(false)}
              isSubmitting={createRequestMutation.isPending}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Services Grid */}
        <FrontendServiceCard services={services} darkMode={darkMode} />

        {/* Pagination Controls */}
        {pagination.total > pagination.limit && (
          <div
            className={`mt-12 flex items-center justify-between border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } px-4 py-3 sm:px-6`}>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                  Showing{" "}
                  <span
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    {pagination.skip + 1}
                  </span>{" "}
                  to{" "}
                  <span
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    {Math.min(
                      pagination.skip + pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    {pagination.total}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ${
                      darkMode
                        ? "ring-gray-700 text-gray-400 hover:bg-gray-800"
                        : "ring-gray-300 text-gray-400 hover:bg-gray-50"
                    } focus:z-20 focus:outline-offset-0 disabled:opacity-50`}>
                    <span className="sr-only">Previous</span>
                    Previous
                  </button>
                  <button
                    disabled={
                      pagination.page * pagination.limit >= pagination.total
                    }
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ${
                      darkMode
                        ? "ring-gray-700 text-gray-400 hover:bg-gray-800"
                        : "ring-gray-300 text-gray-400 hover:bg-gray-50"
                    } focus:z-20 focus:outline-offset-0 disabled:opacity-50`}>
                    <span className="sr-only">Next</span>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Authentication Required"
        darkMode={darkMode}>
        <div className="space-y-6">
          <div className="flex items-start">
            <div
              className={`flex-shrink-0 p-2 rounded-full ${
                darkMode ? "bg-yellow-900/30" : "bg-yellow-100"
              }`}>
              <ExclamationTriangleIcon
                className={`h-6 w-6 ${
                  darkMode ? "text-yellow-600" : "text-yellow-600"
                }`}
              />
            </div>
            <div className="ml-4">
              <h3
                className={`text-lg font-medium ${
                  darkMode ? "text-gray-700" : "text-gray-900"
                }`}>
                Sign in required
              </h3>
              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-gray-700" : "text-gray-600"
                }`}>
                You need to be logged in to request a service. Please sign in to
                continue.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAuthModal(false)}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${
                darkMode ? "text-white" : "text-gray-700"
              } transition-colors`}>
              Cancel
            </button>
            <button
              onClick={handleNavigateToLogin}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}>
              Sign in
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FrontendServicePage;
