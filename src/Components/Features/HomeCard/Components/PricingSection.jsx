import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import {
  FaGlobe,
  FaMobileAlt,
  FaShoppingCart,
  FaUtensils,
  FaBuilding,
  FaHome,
  FaUserTie,
  FaRobot,
} from "react-icons/fa";

const ResearchSection = ({ darkMode }) => {
  const chartRef = useRef();
  const svgRef = useRef();

  // Research facts with colored icons and hover animations
  const researchFacts = [
    {
      id: "global",
      icon: <FaGlobe className="text-2xl text-blue-500" />,
      title: "Global Reach",
      stat: "4.9B",
      value: 4.9,
      description: "Internet users worldwide (2023)",
    },
    {
      id: "mobile",
      icon: <FaMobileAlt className="text-2xl text-green-500" />,
      title: "Mobile Usage",
      stat: "79%",
      value: 79,
      description: "Of all web traffic comes from mobile",
    },
    {
      id: "restaurants",
      icon: <FaUtensils className="text-2xl text-red-500" />,
      title: "Restaurants",
      stat: "82%",
      value: 82,
      description: "With websites saw increased reservations",
    },
    {
      id: "construction",
      icon: <FaBuilding className="text-2xl text-yellow-500" />,
      title: "Construction",
      stat: "78%",
      value: 78,
      description: "Gained more clients with online portfolios",
    },
    {
      id: "real-estate",
      icon: <FaHome className="text-2xl text-purple-500" />,
      title: "Real Estate",
      stat: "79%",
      value: 79,
      description: "Of buyers start their search online",
    },
    {
      id: "consulting",
      icon: <FaUserTie className="text-2xl text-indigo-500" />,
      title: "Consulting",
      stat: "91%",
      value: 91,
      description: "Increased credibility with professional sites",
    },
    {
      id: "ai",
      icon: <FaRobot className="text-2xl text-teal-500" />,
      title: "AI Adoption",
      stat: "67%",
      value: 67,
      description: "Of businesses use AI for customer service",
    },
    {
      id: "ecommerce",
      icon: <FaShoppingCart className="text-2xl text-pink-500" />,
      title: "E-commerce",
      stat: "$6.3T",
      value: 6.3,
      description: "Global online sales in 2023",
    },
  ];

  // Animation variants
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
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 },
    },
  };

  // Typing animation state
  const [displayedStory, setDisplayedStory] = useState([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const storyContent = [
    "Imagine Sarah, who runs a small boutique hotel. For years, she relied on word-of-mouth and local ads.",
    "Then she launched a website with online booking. Within months, her occupancy increased by 40%, with international guests finding her through search engines.",
    "Or consider Mike's construction company. After creating a portfolio website showcasing his projects, he started landing 78% more contracts as clients could easily evaluate his work quality before calling.",
    "In today's digital-first world, your online presence isn't just a brochure—it's your 24/7 salesperson, credibility builder, and customer gateway.",
  ];

  const highlightedWords = {
    "40%": "text-green-500 font-bold",
    "international guests": "text-blue-500 font-bold",
    "78%": "text-yellow-500 font-bold",
    "24/7 salesperson": "text-purple-500 font-bold",
    "credibility builder": "text-indigo-500 font-bold",
    "customer gateway": "text-pink-500 font-bold",
  };

  // Initialize typing animation
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Typing animation effect - word by word
  useEffect(() => {
    if (!isAnimating) return;

    const typingSpeed = 100; // Speed between words
    const paragraphDelay = 1000; // Delay between paragraphs

    if (currentParagraph < storyContent.length) {
      const words = storyContent[currentParagraph].split(" ");

      if (currentWord < words.length) {
        const timer = setTimeout(() => {
          setDisplayedStory((prev) => {
            const newStory = [...prev];
            if (!newStory[currentParagraph]) {
              newStory[currentParagraph] = [];
            }
            newStory[currentParagraph] = [
              ...(newStory[currentParagraph] || []),
              words[currentWord],
            ];
            return newStory;
          });
          setCurrentWord((prev) => prev + 1);
        }, typingSpeed);

        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentParagraph((prev) => prev + 1);
          setCurrentWord(0);
        }, paragraphDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
    }
  }, [currentParagraph, currentWord, isAnimating]);

  // Reset story function
  const resetStory = () => {
    setDisplayedStory([]);
    setCurrentParagraph(0);
    setCurrentWord(0);
    setIsAnimating(true);
  };

  // Chart rendering effect
  useEffect(() => {
    if (!chartRef.current) return;

    const width = chartRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 80, left: 60 };

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent");

    // Create chart group
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(researchFacts.map((d) => d.title))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.top - margin.bottom, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => `${d}%`);

    // X-axis
    chartGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", darkMode ? "#e5e7eb" : "#4b5563");

    // Y-axis
    chartGroup
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("fill", darkMode ? "#e5e7eb" : "#4b5563");

    // Grid lines
    chartGroup
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat("")
      )
      .selectAll("line")
      .style(
        "stroke",
        darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      )
      .style("stroke-dasharray", "3,3");

    // Bar colors
    const colors = {
      "Global Reach": "#3b82f6",
      "Mobile Usage": "#10b981",
      Restaurants: "#ef4444",
      Construction: "#f59e0b",
      "Real Estate": "#8b5cf6",
      Consulting: "#6366f1",
      "AI Adoption": "#14b8a6",
      "E-commerce": "#ec4899",
    };

    // Create bars
    chartGroup
      .selectAll(".bar")
      .data(researchFacts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.title))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr(
        "height",
        (d) => height - margin.top - margin.bottom - yScale(d.value)
      )
      .attr("fill", (d) => colors[d.title])
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);

        // Tooltip
        const tooltip = chartGroup
          .append("g")
          .attr("class", "tooltip")
          .attr(
            "transform",
            `translate(${xScale(d.title) + xScale.bandwidth() / 2},${
              yScale(d.value) - 10
            })`
          );

        tooltip
          .append("rect")
          .attr("x", -40)
          .attr("y", -30)
          .attr("width", 80)
          .attr("height", 25)
          .attr("fill", darkMode ? "#374151" : "#f3f4f6")
          .attr("rx", 4)
          .attr("ry", 4);

        tooltip
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", -15)
          .style("fill", darkMode ? "#f3f4f6" : "#111827")
          .style("font-size", "12px")
          .text(`${d.stat}`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        chartGroup.selectAll(".tooltip").remove();
      });

    // Chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#f3f4f6" : "#111827")
      .text("Digital Adoption Across Industries");

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", darkMode ? "#f3f4f6" : "#111827")
      .text("Percentage / Value");
  }, [darkMode]);

  return (
    <section
      className={`py-16 px-4 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}>
          <motion.h2
            className="text-3xl font-bold mb-4"
            variants={itemVariants}>
            The Digital Advantage for Modern Businesses
          </motion.h2>
          <motion.p
            className="text-xl max-w-2xl mx-auto"
            variants={itemVariants}>
            Data-driven insights showing why every industry needs a strong
            online presence
          </motion.p>
        </motion.div>

        {/* Research Facts Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}>
          {researchFacts.map((fact, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg flex flex-col items-center text-center ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-sm`}
              variants={itemVariants}
              whileHover="hover">
              <motion.div
                className={`p-3 rounded-full mb-3 ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                variants={iconVariants}
                whileHover="hover">
                {fact.icon}
              </motion.div>
              <h3 className="font-bold text-lg">{fact.title}</h3>
              <p className="text-2xl font-bold my-2">{fact.stat}</p>
              <p className="text-sm">{fact.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Storytelling Section */}
        <motion.div
          className={`mb-12 p-8 rounded-lg relative overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="relative z-10">
            <FaQuoteLeft className="text-4xl opacity-20 mb-4 text-blue-500" />

            <h3 className="text-3xl font-bold mb-6 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Why Digital Presence Matters More Than Ever
              </span>
            </h3>

            <div className="space-y-6 text-lg leading-relaxed">
              {displayedStory.map((paragraphWords, pIndex) => {
                return (
                  <motion.p
                    key={pIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-sans">
                    {paragraphWords.map((word, wIndex) => {
                      const cleanWord = word.replace(/[^\w\s%]/g, "");
                      const highlightClass = highlightedWords[cleanWord];
                      return (
                        <React.Fragment key={wIndex}>
                          <span className={highlightClass || ""}>{word}</span>
                          {wIndex < paragraphWords.length - 1 && " "}
                        </React.Fragment>
                      );
                    })}
                    {pIndex === displayedStory.length - 1 &&
                      currentWord < storyContent[pIndex]?.split(" ").length &&
                      isAnimating && (
                        <span
                          className={`inline-block w-2 h-6 ml-1 align-middle ${
                            darkMode ? "bg-white" : "bg-gray-900"
                          } animate-blink`}></span>
                      )}
                  </motion.p>
                );
              })}
            </div>

            <FaQuoteRight className="text-4xl opacity-20 mt-4 ml-auto text-pink-500" />

            {!isAnimating && (
              <motion.div
                className="mt-8 text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <span className="text-sm italic">
                  The businesses thriving today are those meeting customers
                  where they are—online.
                </span>
                <button
                  onClick={resetStory}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Replay Story
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          className="rounded-lg overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate="visible">
          <div
            ref={chartRef}
            className={`w-full p-6 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}>
            <svg ref={svgRef} className="w-full" />
          </div>
        </motion.div>
      </div>

      {/* Blinking cursor animation */}
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  );
};

export default ResearchSection;
