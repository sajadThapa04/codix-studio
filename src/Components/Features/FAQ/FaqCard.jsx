import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const FaqCard = ({ category, questions, darkMode = false }) => {
  return (
    <div className="flex flex-col">
      <h2
        className={`text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}>
        {category}
      </h2>
      <div className="flex flex-col p-4">
        {questions.map((question, index) => (
          <FaqItem
            key={index}
            question={question.question}
            answer={question.answer}
            isFirst={index === 0}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};

const FaqItem = ({ question, answer, isFirst, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(isFirst);

  return (
    <div
      className={`flex flex-col border-t ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } py-2 group`}>
      <button
        className="flex cursor-pointer items-center justify-between gap-6 py-2 w-full text-left"
        onClick={() => setIsOpen(!isOpen)}>
        <p
          className={`text-sm font-medium leading-normal ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}>
          {question}
        </p>
        {isOpen ? (
          <FaCaretUp
            className={`text-lg ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          />
        ) : (
          <FaCaretDown
            className={`text-lg ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          />
        )}
      </button>
      {isOpen && (
        <div
          className={`text-sm font-normal leading-normal pb-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
          {answer}
        </div>
      )}
    </div>
  );
};

export default FaqCard;
