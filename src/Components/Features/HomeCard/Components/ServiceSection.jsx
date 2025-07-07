import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Image imports for each service category
const serviceImages = {
  Web_development: [
    "Web_development/ScreenShowingResponsiveSites.jpg",
    "Web_development/UiScreenMockup.jpg",
    "Web_development/developers-team-collaborating.jpg",
    "Web_development/person-coding-on-laptop.jpg",
  ],
  Mobile_Apps: [
    "Mobile_Apps/dennis-irorere-yvB-g4g8Uj8-unsplash.jpg",
    "Mobile_Apps/mariia-shalabaieva-GhqUDwV5Y5Q-unsplash.jpg",
    "Mobile_Apps/greg-rosenke-SF38xAcEp-E-unsplash.jpg",
    "Mobile_Apps/masakaze-kawakami-aD6mY43V_QQ-unsplash.jpg",
  ],
  Ui_Ux_Design: [
    "Ui_Ux_Design/brian-wangenheim-TlW1b5673_M-unsplash.jpg",
    "Ui_Ux_Design/kevin-shek-pWtydIYnASM-unsplash.jpg",
    "Ui_Ux_Design/ji-weon-p5VsbM42DCo-unsplash.jpg",
    "Ui_Ux_Design/van-tay-media-qUgum4PqOUk-unsplash.jpg",
  ],
  Cloud_Solution: [
    "Cloud_Solution/tyler-eqd0f78u9nI-unsplash.jpg",
    "Cloud_Solution/sigmund-Rez3-Mv7n_c-unsplash.jpg",
    "Cloud_Solution/farhat-altaf-C16YHBerCg4-unsplash.jpg",
    "Cloud_Solution/ChatGPT Image Jun 24, 2025, 12_15_10 AM.png",
  ],
  Data_analytics: [
    "Data_analytics/luke-chesser-JKUTrJ4vK00-unsplash.jpg",
    "Data_analytics/boitumelo-CJJdMHz4s5c-unsplash.jpg",
    "Data_analytics/mario-verduzco-xSdFf1Lcx6o-unsplash.jpg",
    "Data_analytics/rc-xyz-nft-gallery-UqILKDhWiFw-unsplash.jpg",
  ],
  Ai_Integration: [
    "Ai_Integration/guerrillabuzz-RIvSJTiGwLc-unsplash.jpg",
    "Ai_Integration/airfocus-K_VeavYEfdA-unsplash.jpg",
    "Ai_Integration/katja-anokhina-_7ceGXTAtyQ-unsplash.jpg",
    "Ai_Integration/shubham-dhage-2sz-3NrmZYU-unsplash.jpg",
  ],
  Social_media: [
    "Social_media/collabstr-k8plFiceP0I-unsplash.jpg",
    "Social_media/insung-yoon-QoaLVVhjlKY-unsplash.jpg",
    "Social_media/mayank-girdhar-2x9XhQmegeU-unsplash.jpg",
    "Social_media/tony-litvyak-1H1y3XFtcs8-unsplash.jpg",
  ],
  Expert_seminars: [
    "Expert_seminars/kilian-seiler-PZLgTUAhxMM-unsplash.jpg",
    "Expert_seminars/bbc-creative-6YLTd7y1aLo-unsplash.jpg",
    "Expert_seminars/timur-shakerzianov-iUxKrlc5KjA-unsplash.jpg",
    "Expert_seminars/walls-io-PYWRahn0YcQ-unsplash.jpg",
  ],
  Web_Dev_Classes: [
    "Web_Dev_Classes/wonderlane-b9-odQi5oDo-unsplash.jpg",
    "Web_Dev_Classes/gaurav-tiwari-lKxSeXSrKlM-unsplash.jpg",
    "Web_Dev_Classes/patrick-amoy-6DfEbkqsTiA-unsplash.jpg",
    "Web_Dev_Classes/thomas-park-SS-r7BvCqTY-unsplash.jpg",
  ],
};

const services = [
  {
    icon: CodeBracketIcon,
    title: "Web Development",
    description:
      "Custom-built websites with modern frameworks like React and Next.js, optimized for performance, SEO, and user experience.",
    color: "text-blue-500",
    category: "Web_development",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Mobile Apps",
    description:
      "Cross-platform mobile applications using React Native or Flutter, delivering native-like performance.",
    color: "text-green-500",
    category: "Mobile_Apps",
  },
  {
    icon: PaintBrushIcon,
    title: "UI/UX Design",
    description:
      "Intuitive interfaces with user-centered design principles to maximize engagement and conversions.",
    color: "text-purple-500",
    category: "Ui_Ux_Design",
  },
  {
    icon: ServerStackIcon,
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure on AWS, Azure, or Google Cloud with CI/CD pipelines and automation.",
    color: "text-cyan-500",
    category: "Cloud_Solution",
  },
  {
    icon: ChartBarIcon,
    title: "Data Analytics",
    description:
      "Powerful data visualization and business intelligence tools to uncover actionable insights.",
    color: "text-yellow-500",
    category: "Data_analytics",
  },
  {
    icon: CpuChipIcon,
    title: "AI Integration",
    description:
      "Custom AI solutions including chatbots, recommendation systems, and predictive analytics.",
    color: "text-pink-500",
    category: "Ai_Integration",
  },
  {
    icon: MegaphoneIcon,
    title: "Social Media",
    description:
      "Targeted ad campaigns and content strategies to grow your audience and engagement.",
    color: "text-red-500",
    category: "Social_media",
  },
  {
    icon: UserGroupIcon,
    title: "Expert Seminars",
    description:
      "Monthly workshops with industry leaders covering emerging technologies and best practices.",
    color: "text-indigo-500",
    category: "Expert_seminars",
  },
  {
    icon: AcademicCapIcon,
    title: "Web Dev Classes",
    description:
      "Hands-on coding bootcamps with personalized mentorship and real-world projects.",
    color: "text-teal-500",
    category: "Web_Dev_Classes",
  },
];

const ServicesSection = ({ darkMode }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // Initialize image indices
  useEffect(() => {
    const initialIndices = {};
    services.forEach((service, index) => {
      initialIndices[index] = 0;
    });
    setCurrentImageIndices(initialIndices);
  }, []);

  // Image rotation effect
  useEffect(() => {
    // Don't rotate images if any card is being hovered
    if (isHovering) return;

    const interval = setInterval(() => {
      setCurrentImageIndices((prevIndices) => {
        const newIndices = { ...prevIndices };
        Object.keys(prevIndices).forEach((key) => {
          const serviceIndex = parseInt(key);
          const images = serviceImages[services[serviceIndex].category];
          newIndices[key] = (prevIndices[key] + 1) % images.length;
        });
        return newIndices;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering]);

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

  const imageVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
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
              const images = serviceImages[service.category];
              const currentImageIndex = currentImageIndices[index] || 0;
              const currentImage = images[currentImageIndex];

              return (
                <motion.div
                  key={index}
                  className="flex-shrink-0"
                  variants={itemVariants}
                  onHoverStart={() => {
                    setHoveredCard(index);
                    setIsHovering(true);
                  }}
                  onHoverEnd={() => {
                    setHoveredCard(null);
                    setIsHovering(false);
                  }}>
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
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={`${index}-${currentImageIndex}`}
                          src={`/images/${currentImage}`}
                          alt={service.title}
                          className="w-full h-full object-cover absolute inset-0"
                          initial="enter"
                          animate="center"
                          exit="exit"
                          variants={imageVariants}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          loading="lazy"
                        />
                      </AnimatePresence>
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
