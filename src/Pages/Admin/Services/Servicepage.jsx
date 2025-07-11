import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ServiceCard from "../../../Components/Features/AdminCard/Services/ServiceCard";
import {
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
} from "../../../Components/Ui";
import { useCreateService } from "../../../Hooks/Services/serviceHooks";
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

  // Get state from Redux
  const services = useSelector(selectServices);
  const uiStatus = useSelector(selectUiStatus);
  const hasLoadedInitialServices = useSelector(selectHasLoadedInitialServices);

  // Service creation hook
  const createServiceMutation = useCreateService();

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

  const handleServiceAction = async (action, data) => {
    try {
      setError(null);
      setSuccess(null);

      switch (action) {
        case "create": {
          setIsSubmitting(true);
          const formData = new FormData();
          const serviceData = {
            ...data,
            status: data.status,
          };

          Object.entries(serviceData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              if (key === "features" || key === "tags") {
                formData.append(
                  key,
                  Array.isArray(value) ? value.join(",") : value
                );
              } else if (key === "thumbnailFile" && value instanceof File) {
                formData.append("thumbnail", value);
              } else {
                formData.append(key, value);
              }
            }
          });

          await createServiceMutation.mutateAsync(formData, {
            onSuccess: () => {
              setSuccess("Service created successfully!");
              dispatch(fetchServices());
            },
            onError: (error) => {
              setError(error.message || "Failed to create service");
            },
            onSettled: () => {
              setIsSubmitting(false);
            },
          });
          break;
        }

        case "edit":
          navigate(`/admin/services/edit/${data}`);
          break;

        case "refresh":
          dispatch(fetchServices());
          break;

        default:
          break;
      }
    } catch (err) {
      setError(err.message || "An error occurred");
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
      {/* Success Message */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <SuccessMessage
              message={success}
              onDismiss={handleDismissSuccess}
              autoDismiss={true}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <ErrorMessage
              message={error}
              onDismiss={handleDismissError}
              autoDismiss={true}
            />
          </div>
        </div>
      )}

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
