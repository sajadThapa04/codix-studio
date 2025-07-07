import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { loginUser } from "../../Stores/Slices/client.slices";
import LoginCard from "../../Components/Features/UsersCard/LoginCard";

function LoginPage() {
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [localLoading, setLocalLoading] = useState(false); // Add local loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the auth state from Redux
  const { status, error: authError } = useSelector((state) => state.client);
  const isLoading = localLoading || status === "loading"; // Combine local and Redux loading states

  const handleLogin = async (formData) => {
    setLocalLoading(true); // Set loading immediately
    setApiError(null); // Clear previous errors

    try {
      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        setApiSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else if (loginUser.rejected.match(resultAction)) {
        setApiError(
          resultAction.payload || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      setApiError(error.message || "An unexpected error occurred");
    } finally {
      setLocalLoading(false); // Ensure loading is turned off
    }
  };

  const dismissError = () => setApiError(null);
  const dismissSuccess = () => setApiSuccess(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginCard
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={apiError || authError}
          success={apiSuccess}
          onDismissError={dismissError}
          onDismissSuccess={dismissSuccess}
        />

        {/* Additional login options */}
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
              <span className="sr-only">Sign in with Google</span>
              <FcGoogle className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
              <span className="sr-only">Sign in with GitHub</span>
              <FaGithub className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
