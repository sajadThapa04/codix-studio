import React from "react";
import { motion } from "framer-motion";

const PortfolioCard = ({ imageSrc, title, description, darkMode = false }) => {
  return (
    <motion.div
      className="flex flex-col gap-3 pb-3"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}>
      <motion.div
        className="w-full aspect-square rounded-lg overflow-hidden relative"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}>
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Removed the overlay div since it was making images appear dim */}
      </motion.div>
      <div>
        <h3
          className={`text-base font-medium leading-normal ${
            darkMode ? "text-white" : "text-[#111418]"
          }`}>
          {title}
        </h3>
        <p
          className={`text-sm font-normal leading-normal ${
            darkMode ? "text-gray-300" : "text-[#60758a]"
          }`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
