import { useState, useEffect } from "react";

const AchievementNotification = ({ achievements = [], onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (achievements.length > 0) {
            setIsVisible(true);
            setCurrentIndex(0);
        }
    }, [achievements]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const nextAchievement = () => {
        if (currentIndex < achievements.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleClose();
        }
    };

    const prevAchievement = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (!achievements.length || !isVisible) {
        return null;
    }

    const currentAchievement = achievements[currentIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-300 border-2 border-yellow-500 ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <div className="text-3xl mr-3 animate-bounce">🏆</div>
                    <h2 className="text-2xl font-bold text-white">
                        New Achievements Unlocked!
                    </h2>
                </div>

                {/* Achievement Card */}
                <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="text-4xl mr-3">{currentAchievement.icon}</div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-white">
                                    {currentAchievement.name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {currentAchievement.description}
                                </p>
                            </div>
                        </div>
                        <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                            New!
                        </div>
                    </div>
                </div>

                {/* Progress Indicator */}
                {achievements.length > 1 && (
                    <div className="flex justify-center mb-6">
                        <div className="flex space-x-2">
                            {achievements.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                        index === currentIndex
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    {achievements.length > 1 ? (
                        <>
                            <button
                                onClick={prevAchievement}
                                disabled={currentIndex === 0}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    currentIndex === 0
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                            >
                                Previous
                            </button>

                            <span className="text-gray-400 text-sm">
                                {currentIndex + 1} of {achievements.length}
                            </span>

                            <button
                                onClick={nextAchievement}
                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200"
                            >
                                {currentIndex === achievements.length - 1 ? 'Close' : 'Next'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200"
                        >
                            Awesome!
                        </button>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AchievementNotification;
