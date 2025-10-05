import React, { useState, useEffect } from "react";
import {
    TrendingUp,
    Search,
    BarChart3,
    Users,
    Clock,
    Star,
} from "lucide-react";

const SearchAnalytics = ({ onSearchClick, className = "" }) => {
    const [analytics, setAnalytics] = useState({
        popularSearches: [],
        trendingCategories: [],
        relatedSearches: [],
        quickStats: {},
    });

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = () => {
        const mockAnalytics = {
            popularSearches: [
                { query: "general knowledge", count: 1250, trend: "up" },
                { query: "science quiz", count: 980, trend: "up" },
                { query: "history trivia", count: 765, trend: "down" },
                { query: "movie questions", count: 654, trend: "up" },
                { query: "sports quiz", count: 543, trend: "stable" },
                { query: "geography test", count: 432, trend: "up" },
                { query: "art and culture", count: 321, trend: "stable" },
            ],
            trendingCategories: [
                { name: "Science & Nature", growth: "+25%", searches: 2340 },
                { name: "Entertainment: Film", growth: "+18%", searches: 1890 },
                { name: "History", growth: "+12%", searches: 1560 },
                { name: "Sports", growth: "+8%", searches: 1230 },
                { name: "Geography", growth: "+15%", searches: 1100 },
            ],
            relatedSearches: [
                "easy science quiz",
                "hard trivia questions",
                "quick general knowledge",
                "movie trivia 2024",
                "world history quiz",
                "animal science questions",
            ],
            quickStats: {
                totalSearches: 15420,
                avgSearchesPerDay: 512,
                topCategory: "General Knowledge",
                mostActiveTime: "2-4 PM",
            },
        };

        setAnalytics(mockAnalytics);
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case "up":
                return <TrendingUp className="w-3 h-3 text-green-500" />;
            case "down":
                return (
                    <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
                );
            default:
                return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                    Search Analytics
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {analytics.quickStats.totalSearches?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Total Searches
                        </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {analytics.quickStats.avgSearchesPerDay}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Daily Average
                        </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {analytics.quickStats.topCategory}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Top Category
                        </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {analytics.quickStats.mostActiveTime}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Peak Hours
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                            <Search className="w-4 h-4 mr-2" />
                            Popular Searches This Week
                        </h4>
                        <div className="space-y-2">
                            {analytics.popularSearches.map((search, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                    onClick={() =>
                                        onSearchClick?.(search.query)
                                    }
                                >
                                    <div className="flex items-center flex-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400 w-6">
                                            {index + 1}.
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                                            {search.query}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {search.count}
                                        </span>
                                        {getTrendIcon(search.trend)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Trending Categories
                        </h4>
                        <div className="space-y-2">
                            {analytics.trendingCategories.map(
                                (category, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                        onClick={() =>
                                            onSearchClick?.(
                                                `category:${category.name.toLowerCase()}`,
                                            )
                                        }
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {category.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {category.searches} searches
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                {category.growth}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                growth
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Related Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                    {analytics.relatedSearches.map((search, index) => (
                        <button
                            key={index}
                            onClick={() => onSearchClick?.(search)}
                            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                            {search}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Did You Know?
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2" />
                        Most searches happen between 2-4 PM on weekdays
                    </div>
                    <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-2" />
                        Science quizzes are 25% more popular this month
                    </div>
                    <div className="flex items-center">
                        <Search className="w-3 h-3 mr-2" />
                        Average search session includes 3.2 different queries
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchAnalytics;
