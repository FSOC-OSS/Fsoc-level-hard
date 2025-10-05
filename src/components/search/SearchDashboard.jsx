import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Clock, Star, BookOpen, Users, Tag } from 'lucide-react';
import SearchAnalytics from './SearchAnalytics';
import SavedSearches from './SavedSearches';

const SearchDashboard = () => {
  const navigate = useNavigate();

  const handleSearchClick = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const popularCategories = [
    { name: 'General Knowledge', icon: BookOpen, count: 1250, color: 'bg-blue-500' },
    { name: 'Science & Nature', icon: Users, count: 980, color: 'bg-green-500' },
    { name: 'History', icon: Clock, count: 765, color: 'bg-yellow-500' },
    { name: 'Entertainment', icon: Star, count: 654, color: 'bg-purple-500' },
    { name: 'Sports', icon: TrendingUp, count: 543, color: 'bg-red-500' },
    { name: 'Geography', icon: Tag, count: 432, color: 'bg-indigo-500' }
  ];

  const quickSearches = [
    'Easy quiz',
    'Science trivia',
    'Movie questions',
    'World history',
    'Sports facts',
    'Nature quiz'
  ];

  const searchTips = [
    {
      title: 'Use operators',
      description: 'Try "category:science" or "difficulty:hard"',
      example: 'category:science difficulty:medium'
    },
    {
      title: 'Score filtering',
      description: 'Find high-rated content with "score:>4"',
      example: 'score:>4.5 entertainment'
    },
    {
      title: 'Exclude terms',
      description: 'Use "-word" to exclude specific terms',
      example: 'history -war'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Search className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Discover Amazing Quizzes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search through thousands of quizzes, questions, and categories to find exactly what you're looking for
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
                Browse by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {popularCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSearchClick(`category:"${category.name}"`)}
                      className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <div className={`p-3 ${category.color} rounded-full mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-center text-sm">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {category.count} quizzes
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Quick Searches
              </h2>
              <div className="flex flex-wrap gap-3">
                {quickSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchClick(search)}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Search Tips
              </h2>
              <div className="space-y-4">
                {searchTips.map((tip, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {tip.description}
                    </p>
                    <code
                      className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => handleSearchClick(tip.example)}
                    >
                      {tip.example}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Featured Content
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      New Science Quiz Pack
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      50+ questions about space exploration
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      History Challenge
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Test your knowledge of world events
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      Movie Trivia Night
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Classic films and modern blockbusters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <SavedSearches className="lg:col-span-1" />
          <SearchAnalytics onSearchClick={handleSearchClick} className="lg:col-span-1" />
        </div>
      </div>
    </div>
  );
};

export default SearchDashboard;
