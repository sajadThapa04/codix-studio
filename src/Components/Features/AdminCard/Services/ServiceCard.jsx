import React, { useState } from "react";
import CreateService from "./Components/CreateService";
import ManageService from "./Components/ManageService";
import { LoadingSpinner } from "../../../Ui";

const ServiceCard = ({
  mode = "manage",
  services = [],
  onServiceAction,
  isLoading,
  hasLoadedInitialServices,
}) => {
  const [isCreating, setIsCreating] = useState(mode === "create");

  const handleCreateSubmit = async (data) => {
    try {
      await onServiceAction("create", data);
      setIsCreating(false);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  const handleEdit = (serviceId) => {
    onServiceAction("edit", serviceId);
  };

  const handleDelete = (serviceId) => {
    onServiceAction("delete", serviceId);
  };

  const handleRefresh = () => {
    onServiceAction("refresh");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isCreating ? (
        <CreateService
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreating(false)}
          isLoading={isLoading}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsCreating(true)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Loading...
                </>
              ) : (
                "Create New Service"
              )}
            </button>
          </div>
          <ManageService
            services={services}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            hasLoadedInitialServices={hasLoadedInitialServices}
          />
        </>
      )}
    </div>
  );
};

export default ServiceCard;
