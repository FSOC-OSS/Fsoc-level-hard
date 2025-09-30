// src/components/ShareResults.jsx
import React from "react";
import { FaTwitter, FaFacebookF, FaClipboard } from "react-icons/fa";

const ShareResults = ({ score, totalQuestions, percentage }) => {
  const quizURL = window.location.href;
  const message = `🏆 I scored ${score}/${totalQuestions} (${percentage}%) in this quiz! Can you beat me?`;

  const shareToTwitter = () => {
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(quizURL)}`;
    window.open(
      twitterURL,
      "_blank",
      "noopener,noreferrer,width=550,height=400"
    );
  };

  const shareToFacebook = () => {
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      quizURL
    )}&quote=${encodeURIComponent(message)}`;
    window.open(
      facebookURL,
      "_blank",
      "noopener,noreferrer,width=550,height=400"
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${quizURL}`);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy. Please try manually.");
    }
  };

  return (
    <div className="space-y-2 mt-4 sm:mt-6">
      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
        Share your results on Social Media:
      </p>  

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={shareToTwitter}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 text-sm sm:text-base"
        >
          <FaTwitter /> Twitter
        </button>

        <button
          onClick={shareToFacebook}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 text-sm sm:text-base"
        >
          <FaFacebookF /> Facebook
        </button>

        <button
          onClick={copyToClipboard}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-all duration-200 text-sm sm:text-base"
        >
          <FaClipboard /> Copy Link
        </button>
      </div>
    </div>
  );
};

export default ShareResults;
