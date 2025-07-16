import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react"; // For confirmation dialog
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ServiceCard from "../../../Components/Features/AdminCard/Services/ServiceCard";
import {
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
} from "../../../Components/Ui";
import {
  useCreateService,
  useDeleteService,
} from "../../../Hooks/Services/serviceHooks";
import {
  fetchServices,
  selectServices,
  selectUiStatus,
  selectHasLoadedInitialServices,
} from "../../../Stores/Slices/service.slices";

const ServicePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Get state from Redux
  const services = useSelector(selectServices);
  const uiStatus = useSelector(selectUiStatus);
  const hasLoadedInitialServices = useSelector(selectHasLoadedInitialServices);

  // Service creation hook
  const createServiceMutation = useCreateService();
  const deleteServiceMutation = useDeleteService();

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success, error]);

  const handleDismissSuccess = () => {
    setSuccess(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  // Fetch services on initial load
  useEffect(() => {
    if (!hasLoadedInitialServices) {
      dispatch(fetchServices());
    }
  }, [dispatch, hasLoadedInitialServices]);

  const handleDeleteConfirmation = (serviceId) => {
    setServiceToDelete(serviceId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await deleteServiceMutation.mutateAsync(serviceToDelete);
      setSuccess("Service deleted successfully!");
      dispatch(fetchServices());
    } catch (err) {
      setError(err.message || "Failed to delete service");
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleServiceAction = async (action, data) => {
    try {
      setError(null);
      setSuccess(null);

      switch (action) {
        case "create": {
          setIsSubmitting(true);
          const formData = new FormData();

          // Handle regular fields
          formData.append("title", data.title);
          formData.append("description", data.description);
          formData.append("price", data.price);
          formData.append("category", data.category);
          formData.append("isCustomizable", data.isCustomizable);
          formData.append("deliveryTimeInDays", data.deliveryTimeInDays);
          formData.append("status", data.status || "active");

          // Handle features and tags as JSON strings
          if (Array.isArray(data.features)) {
            formData.append("features", JSON.stringify(data.features));
          }

          if (Array.isArray(data.tags)) {
            formData.append("tags", JSON.stringify(data.tags));
          }

          // Handle thumbnail file
          if (data.thumbnailFile instanceof File) {
            formData.append("thumbnail", data.thumbnailFile);
          }

          await createServiceMutation.mutateAsync(formData);
          setSuccess("Service created successfully!");
          dispatch(fetchServices());
          break;
        }

        case "edit":
          navigate(`/admin/services/edit/${data}`);
          break;

        case "refresh":
          dispatch(fetchServices());
          setSuccess("Services refreshed successfully!");
          break;

        case "delete":
          handleDeleteConfirmation(data);
          break;

        default:
          break;
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (uiStatus === "loading" && !hasLoadedInitialServices) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading services..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Success Message with animation */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="animate-in fade-in-0 zoom-in-95 duration-300">
            <SuccessMessage
              message={success}
              onDismiss={handleDismissSuccess}
              autoDismiss={true}
            />
          </div>
        </div>
      )}

      {/* Error Message with animation */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="animate-in fade-in-0 zoom-in-95 duration-300">
            <ErrorMessage
              message={error}
              onDismiss={handleDismissError}
              autoDismiss={true}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Transition.Root show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600 dark:text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Delete Service
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete this service? This
                          action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDelete}
                      disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={isSubmitting}>
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <ServiceCard
        services={services}
        onServiceAction={handleServiceAction}
        isLoading={uiStatus === "loading" || isSubmitting}
        hasLoadedInitialServices={hasLoadedInitialServices}
      />
    </div>
  );
};

export default ServicePage;
