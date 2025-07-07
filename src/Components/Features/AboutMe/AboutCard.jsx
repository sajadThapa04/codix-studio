import React from "react";
import { motion } from "framer-motion";

const AboutCard = ({ icon, title, description, darkMode = false }) => {
  return (
    <motion.div
      className={`flex flex-1 gap-3 rounded-lg border p-4 flex-col ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-[#dee1e3] bg-white"
      }`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}>
      <div className={`${darkMode ? "text-white" : "text-[#131516]"}`}>
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h2
          className={`text-base font-bold leading-tight ${
            darkMode ? "text-white" : "text-[#131516]"
          }`}>
          {title}
        </h2>
        <p
          className={`text-sm font-normal leading-normal ${
            darkMode ? "text-gray-300" : "text-[#6b7780]"
          }`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default AboutCard;
