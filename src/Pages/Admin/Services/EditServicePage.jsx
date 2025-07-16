import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EditServiceCard from "../../../Components/Features/AdminCard/Services/EditServiceCard";
import { useUpdateService } from "../../../Hooks/Services/serviceHooks";
import { ErrorMessage, SuccessMessage } from "../../../Components/Ui";
import {
  fetchServices,
  selectCurrentService,
  selectCurrentServiceStatus,
  selectUiStatus,
  fetchServiceById,
  clearCurrentService,
} from "../../../Stores/Slices/service.slices";

function EditServicePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Get service data from Redux
  const service = useSelector(selectCurrentService);
  const serviceStatus = useSelector(selectCurrentServiceStatus);
  const uiStatus = useSelector(selectUiStatus);

  // Mutation for updating service
  const updateServiceMutation = useUpdateService();

  // Fetch service data on mount
  useEffect(() => {
    dispatch(fetchServiceById(serviceId));

    // Cleanup function to clear current service when unmounting
    return () => {
      dispatch(clearCurrentService());
    };
  }, [dispatch, serviceId]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setIsSaving(true);
      const formDataObj = new FormData();

      // Handle thumbnail separately
      if (formData.thumbnailFile instanceof File) {
        formDataObj.append("thumbnail", formData.thumbnailFile);
      }

      // Handle regular fields
      const regularFields = [
        "title",
        "category",
        "description",
        "price",
        "isCustomizable",
        "deliveryTimeInDays",
        "status",
      ];

      regularFields.forEach((field) => {
        if (formData[field] !== undefined) {
          formDataObj.append(field, formData[field]);
        }
      });

      // Handle features and tags as JSON strings
      if (Array.isArray(formData.features)) {
        formDataObj.append("features", JSON.stringify(formData.features));
      }

      if (Array.isArray(formData.tags)) {
        formDataObj.append("tags", JSON.stringify(formData.tags));
      }

      await updateServiceMutation.mutateAsync({
        serviceId,
        formData: formDataObj,
      });

      setNotification({
        show: true,
        type: "success",
        message: "Service updated successfully",
      });

      dispatch(fetchServices());
      setTimeout(() => navigate("/admin/services"), 1000);
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        message: error.message || "Failed to update service",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (serviceStatus === "loading")
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <FiLoader className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    );

  if (!service || serviceStatus === "failed")
    return <ErrorMessage message="Service not found" />;

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => navigate("/admin/services")}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            whileHover={{ x: -2 }}
            transition={{ type: "spring", stiffness: 300 }}>
            <FiArrowLeft size={18} />
            <span>Back to Services</span>
          </motion.button>
          <motion.h1
            className="text-2xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            Edit Service
          </motion.h1>
          <div className="w-24"></div>
        </div>

        {/* Notification with animation */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              {notification.type === "success" ? (
                <SuccessMessage
                  message={notification.message}
                  onDismiss={() => setNotification({ show: false })}
                />
              ) : (
                <ErrorMessage
                  message={notification.message}
                  onDismiss={() => setNotification({ show: false })}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <EditServiceCard
          service={service}
          onSubmit={handleSubmit}
          isSubmitting={isSaving}
        />
      </div>

      {/* Saving overlay with animation */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="mb-4">
                  <FiLoader className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Saving Changes
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we update your service...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditServicePage;
