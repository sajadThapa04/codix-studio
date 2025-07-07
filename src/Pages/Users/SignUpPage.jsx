import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpCard from "../../Components/Features/UsersCard/SignUpCard";
import { useClientRegistration } from "../../Hooks/client/useClientRegistration";

function SignUpPage() {
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [localLoading, setLocalLoading] = useState(false); // Add local loading state
  const navigate = useNavigate();

  const { mutate: register } = useClientRegistration({
    onSuccess: (response) => {
      console.log("Registration response:", response);
      setApiSuccess(
        response?.message ||
          "Registration successful! Please check your email to verify your account."
      );
      setApiError(null);
      setLocalLoading(false); // Ensure loading is turned off

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error) => {
      console.error("Registration error:", error);
      setApiError(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again."
      );
      setApiSuccess(null);
      setLocalLoading(false); // Ensure loading is turned off on error
    },
  });

  const handleSignUp = (formData) => {
    console.log("Submitting form:", formData);
    setLocalLoading(true);
    setApiError(null);

    // Combine country code and phone number
    const combinedData = {
      ...formData,
      phone: `${formData.countryCode}${formData.phoneNumber}`,
    };

    // Remove the separate phone fields
    delete combinedData.countryCode;
    delete combinedData.country;
    delete combinedData.phoneNumber;

    register(combinedData);
  };

  const dismissError = () => setApiError(null);
  const dismissSuccess = () => setApiSuccess(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SignUpCard
          onSubmit={handleSignUp}
          isLoading={localLoading} // Use local loading state
          error={apiError}
          success={apiSuccess}
          onDismissError={dismissError}
          onDismissSuccess={dismissSuccess}
        />
      </div>
    </div>
  );
}

export default SignUpPage;
