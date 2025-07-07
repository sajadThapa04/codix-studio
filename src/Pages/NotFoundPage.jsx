// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import NotFoundCard from "../Components/404/NotFoundCard";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fcf8f8] group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <NotFoundCard onButtonClick={handleGoBack} />
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
