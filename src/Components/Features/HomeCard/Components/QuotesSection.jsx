import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const QuotesSection = ({ darkMode }) => {
  // Collection of high-quality inspirational quotes
  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Your website is the center of your digital ecosystem, the anchor of all your social media channels.",
      author: "Lorraine Ball",
    },
    {
      text: "Digital design is like painting, except the paint never dries and the canvas keeps expanding.",
      author: "Neville Brody",
    },
    {
      text: "The web is the ultimate customer empowerment tool. It gives users control like never before.",
      author: "Jason Calacanis",
    },
    {
      text: "A website without visitors is like a ship lost in the horizon - full of potential but unseen.",
      author: "Dr. Christopher Dayagdag",
    },
    {
      text: "Content is king, but design is its crown. Together they create an experience that users remember.",
      author: "Bobby Voicu",
    },
    {
      text: "The best websites are those that anticipate users' needs before they even articulate them.",
      author: "Paul Cookson",
    },
    {
      text: "Websites promote you 24/7: No employee will do that. Invest in your digital presence.",
      author: "Paul Cookson",
    },
    {
      text: "Design is not just what it looks like, design is how it works. Great design is invisible.",
      author: "Steve Jobs",
    },
    {
      text: "The future of the web is mobile, responsive, and fast. Users expect nothing less.",
      author: "Gary Vaynerchuk",
    },
    {
      text: "Your digital presence is your new business card, your storefront, and your first impression.",
      author: "Antoine de Saint-Exupéry",
    },
    {
      text: "A user interface is like a joke. If you have to explain it, it's not that good.",
      author: "Martin LeBlanc",
    },
    {
      text: "The power of the web is in its universality. Access by everyone regardless of ability is essential.",
      author: "Tim Berners-Lee",
    },
    {
      text: "Good design is obvious. Great design is transparent - it feels natural and effortless.",
      author: "Joe Sparano",
    },
    {
      text: "The best digital experiences don't just satisfy users—they delight and surprise them.",
      author: "Digital Wisdom",
    },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Function to get a random quote index different from current
  const getRandomQuoteIndex = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex && quotes.length > 1);
    return newIndex;
  };

  // Change quote every 5 seconds, but pause when hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentQuoteIndex(getRandomQuoteIndex());
    }, 5000);

    return () => clearInterval(interval);
  }, [currentQuoteIndex, isHovered]);

  // Animation variants
  const quoteVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    exit: (direction) => ({
      y: direction > 0 ? -20 : 20,
      opacity: 0,
    }),
  };

  return (
    <section
      className={`py-16 px-4 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <span className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            Inspirational
          </span>{" "}
          Words for Digital Creators
        </motion.h2>

        <div
          className="relative h-72 md:h-64"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentQuoteIndex}
              custom={direction}
              variants={quoteVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className={`absolute inset-0 p-8 rounded-xl flex flex-col justify-center items-center ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
              <div className="relative w-full max-w-2xl">
                <FaQuoteLeft
                  className={`text-2xl md:text-3xl mb-4 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } opacity-70 absolute -left-2 -top-2`}
                />

                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-center px-8 md:px-12 leading-relaxed">
                  {quotes[currentQuoteIndex].text}
                </p>

                <FaQuoteRight
                  className={`text-2xl md:text-3xl mt-4 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } opacity-70 absolute -right-2 -bottom-2`}
                />
              </div>

              <motion.p
                className={`text-lg md:text-xl text-right mt-8 w-full max-w-2xl italic ${
                  darkMode ? "text-blue-300" : "text-blue-500"
                } font-medium`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}>
                — {quotes[currentQuoteIndex].author}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8 space-x-3">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentQuoteIndex ? 1 : -1);
                setCurrentQuoteIndex(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentQuoteIndex === index
                  ? darkMode
                    ? "bg-blue-400 scale-150"
                    : "bg-blue-600 scale-150"
                  : darkMode
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              setDirection(1);
              setCurrentQuoteIndex(getRandomQuoteIndex());
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
            }`}>
            Show Another Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuotesSection;
