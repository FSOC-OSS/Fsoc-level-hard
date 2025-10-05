import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition, FadeIn, SlideIn, ScaleIn, StaggerChildren } from './AnimationWrappers';
import { useAnimations } from '../context/AnimationContext';
import BadgeManager from '../utils/BadgeManager';

const BadgesPage = () => {
  useAnimations();
  const [badges, setBadges] = useState({});
  const [stats, setStats] = useState({});
  const [overallProgress, setOverallProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    BadgeManager.initializeBadgeSystem();
    loadBadgeData();
  }, []);

  const loadBadgeData = () => {
    const badgesByCategory = BadgeManager.getBadgesByCategory();
    const badgeStats = BadgeManager.getBadgeStats();
    const progress = BadgeManager.getOverallProgress();

    setBadges(badgesByCategory);
    setStats(badgeStats);
    setOverallProgress(progress);
  };

  const getBadgeProgress = (badge) => {
    return BadgeManager.getBadgeProgress(badge);
  };

  const isBadgeEarned = (badgeId) => {
    const userBadges = BadgeManager.getUserBadges();
    return !!userBadges[badgeId];
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getFilteredBadges = () => {
    if (selectedCategory === 'all') {
      return badges;
    }
    return { [selectedCategory]: badges[selectedCategory] };
  };

  const categories = ['all', ...Object.keys(badges)];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 py-8">
          <SlideIn direction="down" duration={0.4}>
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Setup
              </button>

              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Achievements & Badges</h1>
                <p className="text-purple-200">
                  {overallProgress.earned} of {overallProgress.total} unlocked
                </p>
              </div>

              <div className="w-20"></div>
            </div>
          </SlideIn>

          <FadeIn delay={0.3}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Overall Progress</h2>
                <span className="text-2xl font-bold text-purple-300">{overallProgress.percentage}%</span>
              </div>
              <p className="text-purple-200 text-sm mb-4">Your achievement completion status</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-purple-200 mb-2">
                  <span>Completion</span>
                  <span>{overallProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress.percentage}%` }}
                  ></div>
                </div>
              </div>

              <StaggerChildren staggerDelay={0.1}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300">{overallProgress.earned}</div>
                    <div className="text-sm text-purple-200">Unlocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">{overallProgress.total - overallProgress.earned}</div>
                    <div className="text-sm text-purple-200">Locked</div>
                  </div>
                </div>
              </StaggerChildren>
            </div>
          </FadeIn>

          <SlideIn direction="left" delay={0.5}>
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {formatCategoryName(category)}
                </button>
              ))}
            </div>
          </SlideIn>

          {Object.entries(getFilteredBadges()).map(([categoryName, categoryBadges], catIndex) => (
            <FadeIn key={categoryName} delay={0.6 + catIndex * 0.1}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 capitalize">
                  {formatCategoryName(categoryName)}
                </h2>

                <StaggerChildren staggerDelay={0.08} initialDelay={0.1}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(categoryBadges).map(badge => {
                      const isEarned = isBadgeEarned(badge.id);
                      const progress = getBadgeProgress(badge);

                      return (
                        <ScaleIn key={badge.id}>
                          <div
                            className={`relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                              isEarned ? 'shadow-lg shadow-purple-500/25' : 'opacity-70'
                            }`}
                          >
                            {!isEarned && (
                              <div className="absolute top-4 right-4">
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}

                            <div className={`text-5xl mb-4 ${isEarned ? '' : 'grayscale'}`}>
                              {badge.icon}
                            </div>

                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className={`text-lg font-bold ${isEarned ? 'text-white' : 'text-gray-400'}`}>
                                  {badge.name}
                                </h3>
                                {badge.category && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    badge.category === 'participation' ? 'bg-blue-500/20 text-blue-300' :
                                    badge.category === 'performance' ? 'bg-green-500/20 text-green-300' :
                                    badge.category === 'streak' ? 'bg-orange-500/20 text-orange-300' :
                                    badge.category === 'speed' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-purple-500/20 text-purple-300'
                                  }`}>
                                    {badge.category}
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm ${isEarned ? 'text-purple-200' : 'text-gray-500'}`}>
                                {badge.description}
                              </p>
                            </div>

                            {isEarned ? (
                              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Unlocked!
                              </div>
                            ) : (
                              <div>
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                  <span>Progress</span>
                                  <span>{progress.current}/{progress.required}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress.percentage}%` }}
                                  ></div>
                                </div>
                                <div className="text-right text-xs text-gray-500 mt-1">
                                  {progress.percentage}%
                                </div>
                              </div>
                            )}
                          </div>
                        </ScaleIn>
                      );
                    })}
                  </div>
                </StaggerChildren>
              </div>
            </FadeIn>
          ))}

          {stats && (
            <FadeIn delay={0.8}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Your Stats</h2>
                <StaggerChildren staggerDelay={0.1}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">{stats.quiz_count || 0}</div>
                      <div className="text-sm text-purple-200">Quizzes Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300">{stats.max_consecutive_correct || 0}</div>
                      <div className="text-sm text-purple-200">Best Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300">{stats.best_accuracy || 0}%</div>
                      <div className="text-sm text-purple-200">Best Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">{stats.bookmark_count || 0}</div>
                      <div className="text-sm text-purple-200">Bookmarks</div>
                    </div>
                  </div>
                </StaggerChildren>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BadgesPage;