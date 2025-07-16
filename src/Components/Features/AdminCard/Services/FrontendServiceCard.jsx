import React, { useEffect, useState } from "react";
import {
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import countries from "i18n-iso-countries";
import currency from "currency.js";
import enLocale from "i18n-iso-countries/langs/en.json"; // Direct import

import axios from "axios";

// Register countries
countries.registerLocale(enLocale); // Use the imported JSON

const categoryIcons = {
  "web development": (
    <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500" />
  ),
  "mobile app development": (
    <DevicePhoneMobileIcon className="h-5 w-5 text-purple-500" />
  ),
  default: <SparklesIcon className="h-5 w-5 text-indigo-500" />,
};

// Currency symbols and conversion rates (you might want to fetch these from an API)
const currencyData = {
  US: { code: "USD", symbol: "$", rate: 1 }, // United States
  GB: { code: "GBP", symbol: "£", rate: 0.79 }, // United Kingdom
  EU: { code: "EUR", symbol: "€", rate: 0.93 }, // European Union
  IN: { code: "INR", symbol: "₹", rate: 83.12 }, // India
  JP: { code: "JPY", symbol: "¥", rate: 151.47 }, // Japan
  AU: { code: "AUD", symbol: "A$", rate: 1.52 }, // Australia
  NP: { code: "NPR", symbol: "रु", rate: 133.08 }, // Nepal
  SG: { code: "SGD", symbol: "S$", rate: 1.36 }, // Singapore
  CA: { code: "CAD", symbol: "C$", rate: 1.37 }, // Canada
  // Add more countries as needed
};
const FrontendServiceCard = ({ services = [], darkMode = false }) => {
  const [userCountry, setUserCountry] = useState("US");
  const [isLoading, setIsLoading] = useState(true);
  const [conversionRates, setConversionRates] = useState({});

  useEffect(() => {
    // Get user's country
    const fetchUserCountry = async () => {
      try {
        // First try IP geolocation
        const ipResponse = await axios.get("https://ipapi.co/json/");
        const countryCode = ipResponse.data.country_code;

        if (countryCode && countries.isValid(countryCode)) {
          setUserCountry(countryCode);
        }

        // Then try to get currency conversion rates (you might want to use a paid API for accurate rates)
        const ratesResponse = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        setConversionRates(ratesResponse.data.rates);
      } catch (error) {
        console.error("Error detecting country or fetching rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCountry();
  }, []);

  const formatPrice = (priceInUSD) => {
    if (isLoading) return "Loading...";

    const countryData = currencyData[userCountry] || currencyData.US;
    const rate = conversionRates[countryData.code] || countryData.rate;

    // Case 1: If price is in USD dollars (not cents)
    const priceInDollars = currency(priceInUSD); // Remove { fromCents: true }
    const convertedPrice = priceInDollars.multiply(rate);

    // Case 2: If price is in USD cents (uncomment below)
    // const priceInDollars = currency(priceInUSD, { fromCents: true }).divide(100);
    // const convertedPrice = priceInDollars.multiply(137.47); // Custom rate for NPR

    return `${countryData.symbol}${convertedPrice.format({
      symbol: "",
      decimal: ".",
      separator: ",",
      precision: 2, // Always show 2 decimal places for currency
    })}`;
  };
  const serviceList = Array.isArray(services) ? services : [];

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>
      {serviceList.length === 0 ? (
        <div
          className={`text-center py-16 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Currently updating our service offerings. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service) => (
            <motion.div
              key={service._id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              } border`}>
              {/* Service Thumbnail with Trust Badge */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {service.thumbnail ? (
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                    <span className="text-white text-xl font-bold text-center px-4">
                      {service.title}
                    </span>
                  </div>
                )}
                <div
                  className={`absolute top-3 right-3 rounded-full p-1 shadow-sm ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}>
                  <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`text-xl font-bold line-clamp-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    {service.title}
                  </h3>
                  <span
                    className={`flex items-center text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                    {categoryIcons[service.category.toLowerCase()] ||
                      categoryIcons.default}
                    <span className="ml-1 capitalize">{service.category}</span>
                  </span>
                </div>

                <p
                  className={`mb-4 line-clamp-2 h-12 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                  {service.description}
                </p>

                {/* Key Highlights */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                      {service.features?.[0] || "Custom solution"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                      {service.isCustomizable
                        ? "Fully customizable"
                        : "Standard package"}
                    </span>
                  </div>
                </div>

                {/* Pricing and Delivery */}
                <div
                  className={`flex justify-between items-center pt-4 ${
                    darkMode ? "border-gray-700" : "border-gray-100"
                  } border-t`}>
                  <div className="flex items-center">
                    <CurrencyDollarIcon
                      className={`h-5 w-5 mr-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    />
                    <span
                      className={`font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                      {formatPrice(service.price)}
                    </span>
                    <span
                      className={`ml-1 text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      {service.isCustomizable && "(starting price)"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon
                      className={`h-5 w-5 mr-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                      {service.deliveryTimeInDays} days
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrontendServiceCard;
