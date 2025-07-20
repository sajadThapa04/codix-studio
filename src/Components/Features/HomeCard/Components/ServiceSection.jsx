import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  ServerStackIcon,
  ChartBarIcon,
  CpuChipIcon,
  MegaphoneIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";

const services = [
  {
    icon: CodeBracketIcon,
    title: "Web Development",
    description:
      "Custom-built websites with modern frameworks like React and Next.js, optimized for performance, SEO, and user experience.",
    color: "text-blue-500",
    image: "/images/Web_development/developers-team-collaborating.jpg",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Mobile Apps",
    description:
      "Cross-platform mobile applications using React Native or Flutter, delivering native-like performance.",
    color: "text-green-500",
    image: "/images/Mobile_Apps/dennis-irorere-yvB-g4g8Uj8-unsplash.jpg",
  },
  {
    icon: PaintBrushIcon,
    title: "UI/UX Design",
    description:
      "Intuitive interfaces with user-centered design principles to maximize engagement and conversions.",
    color: "text-purple-500",
    image: "/images/Ui_Ux_Design/kevin-shek-pWtydIYnASM-unsplash.jpg",
  },
  {
    icon: ServerStackIcon,
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure on AWS, Azure, or Google Cloud with CI/CD pipelines and automation.",
    color: "text-cyan-500",
    image: "/images/Cloud_Solution/tyler-eqd0f78u9nI-unsplash.jpg",
  },
  {
    icon: ChartBarIcon,
    title: "Data Analytics",
    description:
      "Powerful data visualization and business intelligence tools to uncover actionable insights.",
    color: "text-yellow-500",
    image: "/images/Data_analytics/luke-chesser-JKUTrJ4vK00-unsplash.jpg",
  },
  {
    icon: CpuChipIcon,
    title: "AI Integration",
    description:
      "Custom AI solutions including chatbots, recommendation systems, and predictive analytics.",
    color: "text-pink-500",
    image: "/images/Ai_Integration/guerrillabuzz-RIvSJTiGwLc-unsplash.jpg",
  },
  {
    icon: MegaphoneIcon,
    title: "Social Media",
    description:
      "Targeted ad campaigns and content strategies to grow your audience and engagement.",
    color: "text-red-500",
    image: "/images/Social_media/mayank-girdhar-2x9XhQmegeU-unsplash.jpg",
  },
  {
    icon: UserGroupIcon,
    title: "Expert Seminars",
    description:
      "Monthly workshops with industry leaders covering emerging technologies and best practices.",
    color: "text-indigo-500",
    image: "/images/Expert_seminars/bbc-creative-6YLTd7y1aLo-unsplash.jpg",
  },
  {
    icon: AcademicCapIcon,
    title: "Web Dev Classes",
    description:
      "Hands-on coding bootcamps with personalized mentorship and real-world projects.",
    color: "text-teal-500",
    image: "/images/Web_Dev_Classes/patrick-amoy-6DfEbkqsTiA-unsplash.jpg",
  },
];

const ServicesSection = ({ darkMode }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    rest: {
      scale: 1,
      y: 0,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      y: -8,
      boxShadow: darkMode
        ? "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageContainerVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const iconVariants = {
    rest: {
      scale: 1,
      opacity: 0.9,
    },
    hover: {
      rotate: [0, 15, -15, 0],
      scale: 1.1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "backOut",
      },
    },
  };

  // Calculate how many cards to show based on screen size
  const getVisibleCards = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const visibleCards = getVisibleCards();

  return (
    <section
      className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}>
          <motion.h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
            variants={itemVariants}>
            Our <span className="text-blue-600">Services</span>
          </motion.h2>
          <motion.p
            className={`text-lg max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
            variants={itemVariants}>
            Comprehensive digital solutions tailored to your specific needs.
          </motion.p>
        </motion.div>

        <div className="relative">
          <motion.div
            className={`grid ${
              visibleCards === 1
                ? "grid-cols-1"
                : visibleCards === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            } gap-6 md:gap-8`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}>
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={index}
                  className="flex-shrink-0"
                  variants={itemVariants}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}>
                  <motion.div
                    className={`p-6 rounded-xl flex flex-col h-full ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } shadow-md overflow-hidden`}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    variants={cardVariants}>
                    <motion.div
                      className="relative overflow-hidden rounded-lg aspect-video mb-4"
                      variants={imageContainerVariants}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover absolute inset-0"
                        loading="lazy"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${
                          darkMode ? "from-gray-900" : "from-white"
                        } to-transparent opacity-70`}></div>
                      <motion.div
                        className={`absolute top-4 right-4 ${service.color}`}
                        variants={iconVariants}>
                        <Icon className="w-8 h-8" />
                      </motion.div>
                    </motion.div>
                    <h3
                      className={`font-bold text-xl mb-3 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                      {service.title}
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>
                      {service.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
