import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useOutletContext, useNavigate } from "react-router-dom";

const TestimonialsPage = () => {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const testimonials = [
    {
      id: 1,
      name: "Emma Johnson",
      role: "Marketing Director, NordicTech",
      country: "Sweden",
      quote:
        "The digital transformation strategy they implemented helped us increase online sales by 180% in just six months.",
      rating: 5,
    },
    {
      id: 2,
      name: "Carlos Mendez",
      role: "CEO, LatinSolutions",
      country: "Mexico",
      quote:
        "Their team's understanding of local markets combined with technical expertise is unparalleled in the industry.",
      rating: 5,
    },
    {
      id: 3,
      name: "Yuki Tanaka",
      role: "CTO, Sakura Innovations",
      country: "Japan",
      quote:
        "The mobile app they developed for us has the highest rating in our category on both app stores. Simply outstanding work.",
      rating: 5,
    },
    {
      id: 4,
      name: "Olivier Dubois",
      role: "Product Manager, EuroConnect",
      country: "France",
      quote:
        "We've worked with many agencies, but none delivered such consistent quality across all projects as this team.",
      rating: 4,
    },
    {
      id: 5,
      name: "Aisha Mohammed",
      role: "Founder, SaharaTech",
      country: "Nigeria",
      quote:
        "They built our e-commerce platform from scratch and trained our team. Now we're processing 500+ orders daily.",
      rating: 5,
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Director, Oceanic Solutions",
      country: "Australia",
      quote:
        "Their cloud migration specialists saved us over $200k in potential downtime costs during our system transition.",
      rating: 5,
    },
    {
      id: 7,
      name: "Sophia Kim",
      role: "VP Digital, SeoulTech",
      country: "South Korea",
      quote:
        "The AI recommendation engine they implemented increased our average order value by 35%.",
      rating: 4,
    },
    {
      id: 8,
      name: "Raj Patel",
      role: "CTO, Mumbai Digital",
      country: "India",
      quote:
        "24/7 support with actual engineers answering calls, not just script readers. This makes all the difference.",
      rating: 5,
    },
    {
      id: 9,
      name: "Anna Kowalski",
      role: "Head of Product, Warsaw Ventures",
      country: "Poland",
      quote:
        "They delivered our MVP in half the time estimated by other agencies we consulted.",
      rating: 5,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-white"
      } py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-extrabold ${
              darkMode ? "text-white" : "text-gray-900"
            } sm:text-4xl`}>
            Client Testimonials
          </h2>
          <p
            className={`mt-3 max-w-2xl mx-auto text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } sm:mt-4`}>
            Hear what our clients say about working with us
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              whileHover={{ y: -5 }}
              className={`rounded-xl p-6 shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : darkMode
                        ? "text-gray-600"
                        : "text-gray-300"
                    } text-lg`}
                  />
                ))}
              </div>
              <div className="flex items-start mb-4">
                <FaQuoteLeft
                  className={`flex-shrink-0 mt-1 mr-2 ${
                    darkMode ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {testimonial.quote}
                </p>
              </div>
              <div className="mt-auto">
                <p
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                  {testimonial.name}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/contact")}
            className={`px-8 py-3 rounded-lg font-medium ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}>
            Contact Us
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsPage;
