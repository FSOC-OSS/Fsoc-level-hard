import React, { useState } from "react";

const Accordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        className="w-full text-left py-3 px-4 flex justify-between items-center hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-2 bg-gray-50 text-gray-700">{answer}</div>
      )}
    </div>
  );
};

export default Accordion;