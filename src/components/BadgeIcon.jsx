import { useState } from "react";

const BadgeIcon = ({ onClick, className = "", showCount = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 group ${className}`}
            title="View Achievements"
        >
            <svg
                className={`w-6 h-6 transition-all duration-200 ${
                    isHovered ? 'text-yellow-400 scale-110' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M10 2L13 8l6 .75-4.12 4.62L16 19l-6-3-6 3 1.12-5.63L1 8.75 7 8l3-6z"
                    clipRule="evenodd"
                />
            </svg>

            {showCount && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    🏆
                </div>
            )}

            {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                    Achievements
                </div>
            )}
        </button>
    );
};

export default BadgeIcon;
