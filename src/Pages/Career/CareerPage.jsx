import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext, useNavigate } from "react-router-dom";
import CareerCard from "../../Components/Features/Career/CareerCard";
import { useCreateCareerApplication } from "../../Hooks/career/careerHooks";

function CareerPage() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();
  const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);

  const { mutate: createApplication, isLoading: isMutationLoading } =
    useCreateCareerApplication();

  const isSubmitting = isMutationLoading || isLocalSubmitting;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
    timeout: null,
  });

  const showNotification = (message, type = "success") => {
    if (notification.timeout) {
      clearTimeout(notification.timeout);
    }

    const newTimeout = setTimeout(
      () =>
        setNotification({ show: false, message: "", type: "", timeout: null }),
      5000
    );

    setNotification({
      show: true,
      message,
      type,
      timeout: newTimeout,
    });
  };

  const closeNotification = () => {
    if (notification.timeout) {
      clearTimeout(notification.timeout);
    }
    setNotification({ show: false, type: "", message: "", timeout: null });
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsLocalSubmitting(true);

      const resumeFile = formData.resume?.[0];
      if (!resumeFile) {
        showNotification("Resume file is required", "error");
        setIsLocalSubmitting(false);
        return;
      }

      const applicationData = {
        fullName: formData.fullName?.trim(),
        email: formData.email?.trim().toLowerCase(),
        phone: formData.phone?.trim(),
        positionApplied: formData.position,
        coverLetter: formData.coverLetter?.trim(),
      };

      await createApplication(
        { applicationData, file: resumeFile },
        {
          onSuccess: () => {
            showNotification("Application submitted successfully!");
            reset();
            setTimeout(() => navigate("/blog"), 3000);
          },
          onError: (error) => {
            showNotification(
              error.message || "Failed to submit application",
              "error"
            );
          },
          onSettled: () => {
            setIsLocalSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error("Submission error:", error);
      showNotification("An unexpected error occurred", "error");
      setIsLocalSubmitting(false);
    }
  };

  return (
    <div className="career-page">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            notification.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}>
          <div className="flex justify-between items-center">
            <span>{notification.message}</span>
            <button
              onClick={closeNotification}
              className="ml-4 text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
        </div>
      )}

      <CareerCard
        darkMode={darkMode}
        register={register}
        handleSubmit={handleSubmit(handleFormSubmit)}
        errors={errors}
        isSubmitting={isSubmitting}
        resumeFileName={watch("resume")?.[0]?.name}
      />
    </div>
  );
}

export default CareerPage;
