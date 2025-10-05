import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen theme-screen flex items-center justify-center p-6">
      <div className="app-card rounded-2xl shadow-xl p-10 text-center max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Quiz App</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Configure your quiz and challenge yourself.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/quiz/setup" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">Start a Quiz</Link>
          <Link to="/bookmarks" className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300">Bookmarks</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
