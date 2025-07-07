import React from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import {
  HeroSection,
  CtaSection,
  ServicesSection,
  ResearchSection,
  MarketingSection,
  HowWeAreDifferent,
  QuotesSection,
  ChartSection,
  CodixServices,
  Features,
} from "./Components";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const HomeCard = () => {
  const { darkMode } = useOutletContext();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <HeroSection darkMode={darkMode} />
      <ServicesSection darkMode={darkMode} />
      <ResearchSection darkMode={darkMode} />
      <ChartSection darkMode={darkMode} />
      <MarketingSection darkMode={darkMode} />
      <CodixServices darkMode={darkMode} />
      <HowWeAreDifferent darkMode={darkMode} />
      <Features darkMode={darkMode} />
      <CtaSection darkMode={darkMode} />
      <QuotesSection darkMode={darkMode} />
    </motion.div>
  );
};

export default HomeCard;
