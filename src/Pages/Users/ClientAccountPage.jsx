import React from "react";
import { Link } from "react-router-dom";
import ClientAccountCard from "../../Components/Features/UsersCard/ClientAccountCard";
import { useGetCurrentClient } from "../../Hooks/client/clientHooks";
import {
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
} from "../../Components/Ui";

function ClientAccountPage() {
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCurrentClient();

  // Properly extract client data from the nested API response
  const client = apiResponse?.data || null;

  // State for success messages
  const [successMessage, setSuccessMessage] = React.useState(null);

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Check for success message in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get("success");
    if (successParam) {
      setSuccessMessage(
        successParam === "profile-updated"
          ? "Profile updated successfully!"
          : "Account settings saved!"
      );
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Loading your account..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto p-4">
          <ErrorMessage
            message={error?.message || "Failed to load account information"}
            onDismiss={() => refetch()}
          />
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-gray-800">
              Try logging in again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto p-4">
          <ErrorMessage message="No client data available" />
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-800">
              Please log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {successMessage && (
          <SuccessMessage
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          My Account
        </h1>

        <div className="space-y-6">
          <ClientAccountCard client={client} />
        </div>
      </div>
    </div>
  );
}

export default ClientAccountPage;
