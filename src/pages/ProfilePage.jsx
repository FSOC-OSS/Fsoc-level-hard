import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    HiUser,
    HiCog,
    HiLogout,
    HiMail,
    HiCalendar,
    HiTrophy,
    HiClock,
    HiBookOpen,
    HiChartBar,
    HiEdit
} from 'react-icons/hi';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userStats] = useState({
        quizzesTaken: 42,
        totalScore: 3245,
        averageScore: 77,
        timeSpent: 125,
        streak: 7,
        achievements: 12
    });

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
    };

    const achievements = [
        { id: 1, name: 'First Quiz', description: 'Complete your first quiz', earned: true },
        { id: 2, name: 'Perfect Score', description: 'Get 100% on a quiz', earned: true },
        { id: 3, name: 'Speed Demon', description: 'Complete a quiz in under 2 minutes', earned: false },
        { id: 4, name: 'Quiz Master', description: 'Take 50 quizzes', earned: false }
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                    <p className="text-gray-600">Manage your account and view your progress</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                                </h2>
                                <p className="text-gray-600 flex items-center">
                                    <HiMail className="w-4 h-4 mr-2" />
                                    {user?.email}
                                </p>
                                <p className="text-gray-500 flex items-center mt-1">
                                    <HiCalendar className="w-4 h-4 mr-2" />
                                    Member since {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleEditProfile}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <HiEdit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <HiBookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{userStats.quizzesTaken}</div>
                        <div className="text-sm text-gray-600">Quizzes</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <HiTrophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{userStats.totalScore}</div>
                        <div className="text-sm text-gray-600">Total Score</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <HiChartBar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{userStats.averageScore}%</div>
                        <div className="text-sm text-gray-600">Average</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <HiClock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{userStats.timeSpent}h</div>
                        <div className="text-sm text-gray-600">Time Spent</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-orange-600 font-bold">🔥</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{userStats.streak}</div>
                        <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-600 font-bold">🏆</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{userStats.achievements}</div>
                        <div className="text-sm text-gray-600">Badges</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button
                                onClick={() => navigate('/badges')}
                                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                            >
                                <HiTrophy className="w-6 h-6 text-blue-600 mr-3" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">View Badges</div>
                                    <div className="text-sm text-gray-600">See your achievements</div>
                                </div>
                            </button>
                            <button
                                onClick={() => navigate('/bookmarks')}
                                className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200"
                            >
                                <HiBookOpen className="w-6 h-6 text-green-600 mr-3" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Quiz History</div>
                                    <div className="text-sm text-gray-600">Review past quizzes</div>
                                </div>
                            </button>
                            <button
                                onClick={() => navigate('/settings/privacy')}
                                className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
                            >
                                <HiCog className="w-6 h-6 text-purple-600 mr-3" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Settings</div>
                                    <div className="text-sm text-gray-600">Privacy & preferences</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        achievement.earned
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                achievement.earned
                                                    ? 'bg-green-100'
                                                    : 'bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-lg">
                                                {achievement.earned ? '🏆' : '🔒'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-medium ${
                                                achievement.earned ? 'text-green-900' : 'text-gray-600'
                                            }`}>
                                                {achievement.name}
                                            </h4>
                                            <p className={`text-sm ${
                                                achievement.earned ? 'text-green-700' : 'text-gray-500'
                                            }`}>
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sign Out */}
                <div className="text-center">
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                        <HiLogout className="w-5 h-5 mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
