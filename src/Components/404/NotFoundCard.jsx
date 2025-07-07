// src/components/404/NotFoundCard.jsx
import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const NotFoundCard = ({
  title = "Oops! Page Not Found",
  subtitle = "The page you're looking for doesn't exist or has been moved. Let's get you back on track!",
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCIQLmvitQiQX3ZlnAMEmDHTiHuchbKxUuChv3i5kztS8rIQS91CSxRTOa29LvOmaJbssSREx7oY2-A8Suqh-QHqR9cEfdRmcmYRCm2MJNd6mU83c5TiOUwTsNCrtXXpto_NccJgeXOG5qxhG_EIE34Y-913VZOCa1R568yTtvSkH4w1gK16kxDq4ustLMV3yEUjQDS_hdCsfJLV2o8vsyGHXw4PLHvQL1LlVtZXle57CsMseu37sa8RDwx0SxAoqi-FWBBOPxurIE",
  heading = "Lost in Space?",
  description = "It seems you've wandered off the beaten path. Don't worry, we'll help you find your way back.",
  buttonText = "Return to Home",
  footerText = "If you believe this is an error, please contact support.",
  onButtonClick,
}) => {
  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <h1 className="text-[#1b0e0e] tracking-light text-2xl md:text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
        {title}
      </h1>
      <p className="text-[#1b0e0e] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
        {subtitle}
      </p>
      <div className="flex flex-col px-4 py-6">
        <div className="flex flex-col items-center gap-6">
          <div
            className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg w-full max-w-[360px]"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <p className="text-[#1b0e0e] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
              {heading}
            </p>
            <p className="text-[#1b0e0e] text-sm font-normal leading-normal max-w-[480px] text-center">
              {description}
            </p>
          </div>
          <button
            onClick={onButtonClick}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f3e7e8] text-[#1b0e0e] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e8d9da] transition-colors duration-200 gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="truncate">{buttonText}</span>
          </button>
        </div>
      </div>
      <p className="text-[#994d51] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
        {footerText}
      </p>
    </div>
  );
};

export default NotFoundCard;
