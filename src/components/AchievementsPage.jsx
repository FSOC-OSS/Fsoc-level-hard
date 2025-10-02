import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AchievementManager from "../utils/AchievementManager";

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState({});
    const [overallProgress, setOverallProgress] = useState({ unlocked: 0, total: 0, percentage: 0 });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = () => {
        const allBadges = AchievementManager.getAllBadges();
        const userStats = AchievementManager.getStats();
        const progress = AchievementManager.getOverallProgress();

        setAchievements(allBadges);
        setStats(userStats);
        setOverallProgress(progress);
    };

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(badge => badge.category === selectedCategory);

    const categories = [
        { id: 'all', name: 'All Badges', icon: '🏆' },
        { id: 'participation', name: 'Participation', icon: '📚' },
        { id: 'performance', name: 'Performance', icon: '⭐' }
    ];

    const getProgressForBadge = (badge) => {
        if (badge.unlocked) return 100;
        return AchievementManager.getProgressTowardsBadge(badge.id);
    };

    const BadgeCard = ({ badge }) => {
        const progress = getProgressForBadge(badge);
        const isLocked = !badge.unlocked;

        return (
            <div className={`bg-gray-800 rounded-xl p-6 border transition-all duration-200 ${
                isLocked ? 'border-gray-700 opacity-75' : 'border-gray-600 hover:border-gray-500'
            }`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div className={`text-3xl mr-3 ${isLocked ? 'grayscale opacity-50' : ''}`}>
                            {badge.icon}
                        </div>
                        <div>
                            <h3 className={`font-bold ${isLocked ? 'text-gray-400' : 'text-white'}`}>
                                {badge.name}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {badge.description}
                            </p>
                        </div>
                    </div>
                    {isLocked && (
                        <div className="text-gray-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>

                {badge.unlocked ? (
                    <div className="text-green-400 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Unlocked!
                        {badge.unlockedAt && (
                            <span className="ml-2 text-gray-500">
                                {new Date(badge.unlockedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-gray-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {badge.unlocked && (
                    <div className="mt-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            badge.category === 'participation'
                                ? 'bg-blue-900 text-blue-300'
                                : 'bg-green-900 text-green-300'
                        }`}>
                            {badge.category}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Setup
                    </button>

                    <h1 className="text-3xl font-bold text-center">Achievements & Badges</h1>

                    <div className="text-sm text-gray-400">
                        {overallProgress.unlocked} of {overallProgress.total} unlocked
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Overall Progress</h2>
                    <p className="text-gray-400 mb-4">Your achievement completion status</p>

                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span>Completion</span>
                            <span>{overallProgress.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${overallProgress.percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-purple-400">{overallProgress.unlocked}</div>
                            <div className="text-sm text-gray-400">Unlocked</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-400">{overallProgress.total - overallProgress.unlocked}</div>
                            <div className="text-sm text-gray-400">Locked</div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                selectedCategory === category.id
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Participation Section */}
                {(selectedCategory === 'all' || selectedCategory === 'participation') && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-6">Participation</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements
                                .filter(badge => badge.category === 'participation')
                                .map(badge => (
                                    <BadgeCard key={badge.id} badge={badge} />
                                ))}
                        </div>
                    </div>
                )}

                {/* Performance Section */}
                {(selectedCategory === 'all' || selectedCategory === 'performance') && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-6">Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements
                                .filter(badge => badge.category === 'performance')
                                .map(badge => (
                                    <BadgeCard key={badge.id} badge={badge} />
                                ))}
                        </div>
                    </div>
                )}

                {/* Filtered View */}
                {selectedCategory !== 'all' && selectedCategory !== 'participation' && selectedCategory !== 'performance' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAchievements.map(badge => (
                            <BadgeCard key={badge.id} badge={badge} />
                        ))}
                    </div>
                )}

                {/* Stats Summary */}
                <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Your Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-400">{stats.quizzes_completed || 0}</div>
                            <div className="text-sm text-gray-400">Quizzes Completed</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-400">{stats.best_streak || 0}</div>
                            <div className="text-sm text-gray-400">Best Streak</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-yellow-400">{stats.perfect_scores || 0}</div>
                            <div className="text-sm text-gray-400">Perfect Scores</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-400">{stats.bookmarks_made || 0}</div>
                            <div className="text-sm text-gray-400">Bookmarks Made</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementsPage;
