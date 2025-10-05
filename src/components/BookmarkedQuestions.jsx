import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition, FadeIn, SlideIn, ScaleIn, StaggerChildren } from './AnimationWrappers';
import { useAnimations } from '../context/AnimationContext';
import BookmarkManager from '../utils/BookmarkManager';

const BookmarkedQuestions = () => {
  useAnimations();
  const [bookmarks, setBookmarks] = useState([]);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const savedBookmarks = BookmarkManager.getBookmarks();
    setBookmarks(savedBookmarks);
  };

  const handleRemoveBookmark = (questionId) => {
    const result = BookmarkManager.removeBookmark(questionId);
    if (result.success) {
      loadBookmarks();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
      const result = BookmarkManager.clearAllBookmarks();
      if (result.success) {
        loadBookmarks();
      }
    }
  };

  const toggleAnswer = (questionId) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeDisplay = (type) => {
    return type === 'multiple' ? 'Multiple Choice' : 'True/False';
  };

  if (bookmarks.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6">
          <div className="max-w-4xl mx-auto">
            <SlideIn direction="down" delay={0.2}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Setup
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-white">Bookmarked Questions</h1>
                <div className="w-24"></div>
              </div>
            </SlideIn>

            <ScaleIn delay={0.4}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-white mb-2">No Bookmarked Questions</h2>
                  <p className="text-white/70 mb-8">Start a quiz and bookmark interesting questions to review them later!</p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 py-3 px-8 rounded-xl font-semibold text-black hover:scale-105 transition-transform"
                >
                  Start Quiz
                </button>
              </div>
            </ScaleIn>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6">
        <div className="max-w-4xl mx-auto">
          <SlideIn direction="down" delay={0.2}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Setup
                </button>
              </div>
              <h1 className="text-3xl font-bold text-white">Bookmarked Questions</h1>
              <button
                onClick={handleClearAll}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>
          </SlideIn>

          <FadeIn delay={0.3}>
            <div className="mb-6">
              <p className="text-white/80">You have {bookmarks.length} bookmarked question{bookmarks.length !== 1 ? 's' : ''}</p>
            </div>
          </FadeIn>

          <StaggerChildren staggerDelay={0.1} initialDelay={0.4}>
            <div className="space-y-6">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <StaggerChildren staggerDelay={0.05}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(bookmark.difficulty)}`}>
                            {bookmark.difficulty}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {bookmark.category}
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {getTypeDisplay(bookmark.type)}
                          </span>
                        </div>
                      </StaggerChildren>
                      <SlideIn direction="left" delay={0.1}>
                        <h3 className="text-xl font-semibold text-white mb-4 leading-relaxed">
                          {bookmark.question}
                        </h3>
                      </SlideIn>
                    </div>
                    <ScaleIn delay={0.2}>
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Remove bookmark"
                      >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </ScaleIn>
                  </div>

                  <button
                    onClick={() => toggleAnswer(bookmark.id)}
                    className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {expandedAnswers[bookmark.id] ? 'Hide Answer' : 'Show Answer'}
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedAnswers[bookmark.id] ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedAnswers[bookmark.id] && (
                    <FadeIn duration={0.3}>
                      <div className="mt-4 p-4 bg-white/10 rounded-lg">
                        <StaggerChildren staggerDelay={0.08}>
                          <div className="space-y-3">
                            {bookmark.answers.map((answer, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border-2 transition-colors ${
                                  answer === bookmark.correct_answer
                                    ? 'bg-green-500/20 border-green-400 text-green-100'
                                    : 'bg-white/10 border-white/20 text-white/80'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                      answer === bookmark.correct_answer
                                        ? 'bg-green-400 text-green-900'
                                        : 'bg-white/20 text-white'
                                    }`}>
                                      {String.fromCharCode(65 + index)}
                                    </div>
                                    <span className="text-sm">{answer}</span>
                                  </div>
                                  {answer === bookmark.correct_answer && (
                                    <div className="text-green-400">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </StaggerChildren>

                        {bookmark.bookmarkedAt && (
                          <SlideIn direction="up" delay={0.4}>
                            <div className="mt-4 pt-3 border-t border-white/20">
                              <p className="text-xs text-white/60">
                                Bookmarked on {new Date(bookmark.bookmarkedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </SlideIn>
                        )}
                      </div>
                    </FadeIn>
                  )}
                </div>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </div>
    </PageTransition>
  );
};

export default BookmarkedQuestions;