import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "../../Ui";
import { useUpdateClientAddress } from "../../../Hooks/client/clientHooks";

function ClientAccountCard({ client }) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    country: client?.address?.country || "",
    city: client?.address?.city || "",
    street: client?.address?.street || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const updateAddressMutation = useUpdateClientAddress();

  // Initialize form with client data when component mounts or client changes
  useEffect(() => {
    setAddressForm({
      country: client?.address?.country || "",
      city: client?.address?.city || "",
      street: client?.address?.street || "",
    });
  }, [client]);

  // Validate form whenever addressForm changes
  useEffect(() => {
    const errors = {};
    const hasAtLeastOneField = Object.values(addressForm).some(
      (value) => value.trim() !== ""
    );

    if (!hasAtLeastOneField) {
      errors.general = "At least one address field is required";
    }

    setFormErrors(errors);
    setIsFormValid(hasAtLeastOneField);
  }, [addressForm]);

  if (!client) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
        <p className="text-gray-600 dark:text-gray-300">
          No client data available
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          Please log in
        </Link>
      </div>
    );
  }

  const getInitial = () => {
    if (client.fullName) {
      return client.fullName.charAt(0).toUpperCase();
    }
    if (client.email) {
      return client.email.charAt(0).toUpperCase();
    }
    return "👤";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Filter out empty fields
      const payload = Object.fromEntries(
        Object.entries(addressForm).filter(([_, value]) => value.trim() !== "")
      );

      const result = await updateAddressMutation.mutateAsync(payload);

      if (result?.success) {
        setSuccess("Address updated successfully!");
        setTimeout(() => {
          setSuccess(null);
          setShowAddressModal(false);
        }, 2000);
      } else {
        setError(result?.message || "Failed to update address");
      }
    } catch (err) {
      setError(err.message || "Failed to update address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Profile Header */}
      <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
            {client.profileImage &&
            client.profileImage !== "default-profile.png" ? (
              <img
                src={client.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-medium text-white">
                {getInitial()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {client.fullName || "Client"}
            </h1>
            <p className="text-blue-100 text-sm mt-1">{client.email}</p>
            <span className="mt-2 inline-block bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {client.role || "client"}
            </span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Email:</p>
            <p className="text-gray-900 dark:text-gray-100 md:col-span-3">
              {client.email}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Phone:</p>
            <p className="text-gray-900 dark:text-gray-100 md:col-span-3">
              {client.phone || "Not provided"}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Status:</p>
            <p className="md:col-span-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === "active"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : client.status === "inactive"
                    ? "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    client.status === "active"
                      ? "bg-green-500 dark:bg-green-400"
                      : client.status === "inactive"
                      ? "bg-amber-500 dark:bg-amber-400"
                      : "bg-red-500 dark:bg-red-400"
                  }`}></span>
                {client.status || "unknown"}
              </span>
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Email Verified:
            </p>
            <p className="md:col-span-3 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  client.isEmailVerified
                    ? "bg-green-500 dark:bg-green-400"
                    : "bg-red-500 dark:bg-red-400"
                }`}></span>
              <span
                className={
                  client.isEmailVerified
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }>
                {client.isEmailVerified ? "Verified" : "Not Verified"}
              </span>
            </p>
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Address
            </h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              {client.address ? "Edit" : "Add"}
            </button>
          </div>

          {client.address ? (
            <div className="space-y-3">
              {client.address.country && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Country:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 md:col-span-3">
                    {client.address.country}
                  </p>
                </div>
              )}

              {client.address.city && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    City:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 md:col-span-3">
                    {client.address.city}
                  </p>
                </div>
              )}

              {client.address.street && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Street:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 md:col-span-3">
                    {client.address.street}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No address on file
            </p>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setError(null);
          setSuccess(null);
          setFormErrors({});
          // Reset form to original values when closing
          setAddressForm({
            country: client?.address?.country || "",
            city: client?.address?.city || "",
            street: client?.address?.street || "",
          });
        }}
        title={client.address ? "Update Address" : "Add Address"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 text-sm rounded-lg border border-red-100 dark:border-red-900">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 text-sm rounded-lg border border-green-100 dark:border-green-900">
              {success}
            </div>
          )}
          {formErrors.general && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 text-sm rounded-lg border border-amber-100 dark:border-amber-900">
              {formErrors.general}
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={addressForm.country}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-sm border ${
                formErrors.general && !addressForm.country.trim()
                  ? "border-amber-300 dark:border-amber-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Enter country"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={addressForm.city}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-sm border ${
                formErrors.general && !addressForm.city.trim()
                  ? "border-amber-300 dark:border-amber-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="street"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={addressForm.street}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-sm border ${
                formErrors.general && !addressForm.street.trim()
                  ? "border-amber-300 dark:border-amber-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Enter street address"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
              disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  : "bg-blue-400 dark:bg-blue-500 cursor-not-allowed"
              } rounded-md shadow-sm transition-colors`}
              disabled={isSubmitting || !isFormValid}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Address"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ClientAccountCard;
