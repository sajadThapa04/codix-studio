import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLoginCard from "../../Components/Features/AdminCard/AdminLoginCard";
import { adminLogin } from "../../Stores/Slices/admin.slices";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const resultAction = await dispatch(adminLogin(credentials));

      if (adminLogin.fulfilled.match(resultAction)) {
        setSuccess("Login successful! Redirecting...");
        // Redirect to admin after successful login
        setTimeout(() => navigate("/admin"), 1500);
      } else if (adminLogin.rejected.match(resultAction)) {
        setError(resultAction.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AdminLoginCard
          onSubmit={handleAdminLogin}
          isLoading={isLoading}
          error={error}
          success={success}
          onDismissError={() => setError(null)}
          onDismissSuccess={() => setSuccess(null)}
        />

        {/* Additional admin login info or links can go here */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>For authorized personnel only</p>
          <p className="mt-1">Contact support if you need access</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
