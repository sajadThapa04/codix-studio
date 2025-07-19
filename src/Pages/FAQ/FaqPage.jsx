import React from "react";
import {
  useOutletContext,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import FaqCard from "../../Components/Features/FAQ/FaqCard";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

function FaqPage() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();
  const faqData = [
    {
      category: "General Information",
      questions: [
        {
          question: "How can I contact your team?",
          answer: (
            <>
              You can reach us through multiple channels:
              <ul
                className={`list-disc pl-5 mt-2 space-y-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                <li>Email: contact@codixstudio.com (24/7 support)</li>
                <li>Phone: +977 9742 902061 (Mon-Fri, 9AM-6PM NPT)</li>
                <li>
                  Live Chat: Available on our website during business hours
                </li>
                <li>Contact Form: Submit inquiries through our website</li>
              </ul>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                We typically respond within 1 business day.
              </p>
            </>
          ),
        },
        {
          question: "Where is your company located?",
          answer: (
            <div className="flex items-start mt-2">
              <MapPinIcon
                className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              />
              <div className="ml-3">
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Kathmandu: Hattisar, Naxal
                </p>
                <p
                  className={`mt-1 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                  Sydney: 5/12 Clarence St, NSW, 2000
                </p>
              </div>
            </div>
          ),
        },
        {
          question: "What are your business hours?",
          answer:
            "Our core business hours are Monday-Friday, 9:00 AM to 6:00 PM NPT. Support is available 24/7 for urgent matters.",
        },
      ],
    },
    {
      category: "Our Services",
      questions: [
        {
          question: "What services do you offer?",
          answer: (
            <>
              We provide comprehensive digital solutions:
              <ul
                className={`list-disc pl-5 mt-2 space-y-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                <li>
                  <strong className={darkMode ? "text-white" : "text-gray-800"}>
                    Web Development:
                  </strong>{" "}
                  Custom websites, e-commerce platforms, web applications
                </li>
                <li>
                  <strong className={darkMode ? "text-white" : "text-gray-800"}>
                    Mobile Apps:
                  </strong>{" "}
                  iOS and Android native and cross-platform development
                </li>
                <li>
                  <strong className={darkMode ? "text-white" : "text-gray-800"}>
                    UI/UX Design:
                  </strong>{" "}
                  User-centered design for optimal conversion
                </li>
                <li>
                  <strong className={darkMode ? "text-white" : "text-gray-800"}>
                    Digital Marketing:
                  </strong>{" "}
                  SEO, PPC, and social media strategies
                </li>
                <li>
                  <strong className={darkMode ? "text-white" : "text-gray-800"}>
                    Cloud Solutions:
                  </strong>{" "}
                  Scalable infrastructure and migration services
                </li>
              </ul>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                All our services come with free initial consultation.
              </p>
            </>
          ),
        },
        {
          question: "What makes your services better than competitors?",
          answer:
            "We combine cutting-edge technology with proven business strategies. Our unique value includes: 24/7 support, money-back guarantee, free post-launch maintenance for 30 days, and dedicated account managers for all projects.",
        },
        {
          question: "Do you offer free consultations?",
          answer:
            "Yes! We provide free 60-minute consultations to understand your needs and propose tailored solutions. Book through our website or by calling our sales team.",
        },
      ],
    },
    {
      category: "Pricing & Payments",
      questions: [
        {
          question: "What are your pricing models?",
          answer: (
            <>
              We offer flexible pricing options tailored to your project needs:
              <div
                className={`mt-3 space-y-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                <div>
                  <strong
                    className={`block ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}>
                    1. Fixed-Price Projects:
                  </strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>For well-defined scopes with clear requirements</li>
                    <li>
                      Pay in milestones (typically 30% upfront, 40% at midpoint,
                      30% on completion)
                    </li>
                    <li>
                      Example: $10,000 website project = $3,000 (start), $4,000
                      (midpoint), $3,000 (delivery)
                    </li>
                  </ul>
                </div>

                <div>
                  <strong
                    className={`block ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}>
                    2. Time-and-Materials:
                  </strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>For evolving projects with changing requirements</li>
                    <li>
                      Weekly or monthly billing based on actual hours worked
                    </li>
                    <li>
                      Example: $100/hour developer × estimated 150 hours =
                      ~$15,000 (billed weekly)
                    </li>
                  </ul>
                </div>

                <div>
                  <strong
                    className={`block ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}>
                    3. Monthly Retainers:
                  </strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>For ongoing services and maintenance</li>
                    <li>Fixed monthly fee for agreed-upon services</li>
                    <li>
                      Example: $2,500/month for 40 hours of development support
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className={`mt-4 ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                } p-4 rounded-lg`}>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } font-medium`}>
                  We provide: 10% discount for nonprofits, 15% for startups
                  (under 2 years old), and 20% for annual retainers.
                </p>
                <p
                  className={`mt-2 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                  Ask about our referral program for additional savings.
                </p>
              </div>
              <p
                className={`mt-3 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                All pricing is transparent with no hidden fees. We'll provide a
                detailed payment schedule in your proposal.
              </p>
            </>
          ),
        },
        {
          question: "What payment methods do you accept?",
          answer: (
            <>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                We accept all major payment methods:
              </p>
              <ul
                className={`list-disc pl-5 mt-2 space-y-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                <li>Credit cards (Visa, Mastercard, American Express)</li>
                <li>Bank transfers (domestic and international)</li>
                <li>PayPal and other digital wallets</li>
                <li>Cryptocurrency (BTC, ETH, USDT)</li>
              </ul>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Payment plans available for projects over $10,000.
              </p>
            </>
          ),
        },
      ],
    },
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I begin a project with you?",
          answer:
            "Our simple 3-step process: 1) Schedule free consultation, 2) Receive proposal with timeline and cost, 3) Sign contract and begin work. Most projects start within 3 business days of signing.",
        },
        {
          question: "What information do you need to start?",
          answer:
            "For initial consultation, just your contact info and project goals. For formal proposal, we may request: business objectives, target audience details, competitors, and any existing branding materials.",
        },
        {
          question: "Can I see examples of your work?",
          answer: (
            <>
              Absolutely! Visit our{" "}
              <Link
                to="/portfolio"
                className={`${
                  darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                } underline`}>
                portfolio page
              </Link>{" "}
              or request specific case studies from our sales team. We can
              provide references from similar clients upon request.
            </>
          ),
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>
      <div className="flex-grow px-4 md:px-10 lg:px-20 xl:px-40 py-10">
        <div className="max-w-[960px] mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-between gap-3 p-4">
            <motion.div
              variants={itemVariants}
              className="flex min-w-72 flex-col gap-3">
              <h2
                className={`text-3xl md:text-4xl font-bold leading-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                Help Center
              </h2>
              <p
                className={`text-base ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Find answers to common questions about our services and how we
                can help your business grow.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8">
            {faqData.map((section, index) => (
              <motion.div key={index} variants={itemVariants}>
                <FaqCard
                  category={section.category}
                  questions={section.questions}
                  darkMode={darkMode}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`mt-16 p-8 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            } text-center`}>
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
              Still have questions?
            </h2>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="flex items-center">
                <EnvelopeIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                />
                <a
                  href="mailto:contact@codixstudio.com"
                  className={`ml-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  contact@codixstudio.com
                </a>
              </div>
              <div className="flex items-center">
                <PhoneIcon
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                />
                <a
                  href="tel:+9779742902061"
                  className={`ml-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  +977 9742 902061
                </a>
              </div>
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/contact")}
              className={`px-8 py-3 rounded-lg font-medium ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}>
              Contact Support
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default FaqPage;
