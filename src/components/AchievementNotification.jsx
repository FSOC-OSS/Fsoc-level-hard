import React, { useState, useEffect } from 'react';

const AchievementNotification = ({ badges, onClose, onViewAll }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  useEffect(() => {
    if (badges && badges.length > 0) {
      setIsVisible(true);
      setCurrentBadgeIndex(0);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (currentBadgeIndex < badges.length - 1) {
            setCurrentBadgeIndex(prev => prev + 1);
          } else {
            onClose();
          }
        }, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [badges, currentBadgeIndex, onClose]);

  if (!badges || badges.length === 0) return null;

  const currentBadge = badges[currentBadgeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`
          relative max-w-md w-full transform transition-all duration-500 ease-out
          ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}
        `}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl animate-pulse" />
        <div className="absolute inset-1 bg-gray-900 rounded-xl" />

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="text-2xl animate-bounce">🏆</div>
            <h2 className="text-2xl font-bold text-white">
              New Achievement Unlocked!
            </h2>
          </div>

          {/* Badge Display */}
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">
              {currentBadge.icon}
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {currentBadge.name}
              </h3>
              <p className="text-gray-300 text-sm">
                {currentBadge.description}
              </p>
            </div>

            {/* New Badge Indicator */}
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              New!
            </div>
          </div>

          {/* Badge Counter */}
          {badges.length > 1 && (
            <div className="mb-6">
              <div className="flex justify-center gap-2 mb-2">
                {badges.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentBadgeIndex ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm">
                {currentBadgeIndex + 1} of {badges.length} new achievements
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {badges.length > 1 && currentBadgeIndex < badges.length - 1 && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => setCurrentBadgeIndex(prev => prev + 1), 300);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Next Achievement →
              </button>
            )}

            <button
              onClick={onViewAll}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              View All Achievements
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Continue Quiz
            </button>
          </div>
        </div>

        {/* Animated Sparkles */}
        <div className="absolute -top-4 -right-4">
          <div className="text-yellow-400 text-2xl animate-ping">✨</div>
        </div>
        <div className="absolute -bottom-4 -left-4">
          <div className="text-yellow-400 text-xl animate-ping animation-delay-300">⭐</div>
        </div>
        <div className="absolute top-1/2 -right-6">
          <div className="text-orange-400 text-lg animate-ping animation-delay-600">💫</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
