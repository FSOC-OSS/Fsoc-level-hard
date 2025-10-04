import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search FAQs..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
};

export default SearchBar;