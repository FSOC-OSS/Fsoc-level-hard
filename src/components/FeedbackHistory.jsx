import React, { useState, useEffect } from 'react';
import { FadeIn, SlideIn, ScaleIn, StaggerChildren } from './AnimationWrappers';
import { useAnimations } from '../context/AnimationContext';
import FeedbackManager from '../utils/FeedbackManager';
import StarRating from './StarRating';

const FeedbackHistory = () => {
    useAnimations();
    const [history, setHistory] = useState({ ratings: [], reports: [], comments: [] });
    const [activeTab, setActiveTab] = useState('ratings');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const userHistory = FeedbackManager.getUserFeedbackHistory();
        setHistory(userHistory);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const tabs = [
        { id: 'ratings', label: 'Ratings', icon: '⭐', count: history.ratings.length },
        { id: 'reports', label: 'Reports', icon: '⚠️', count: history.reports.length },
        { id: 'comments', label: 'Comments', icon: '💬', count: history.comments.length }
    ];

    return (
        <FadeIn duration={0.4}>
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <SlideIn direction="down" delay={0.2}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Feedback History</h2>
                </SlideIn>

                <StaggerChildren staggerDelay={0.1} initialDelay={0.3}>
                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200 border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </StaggerChildren>

                <div className="space-y-4">
                    {activeTab === 'ratings' && (
                        <>
                            {history.ratings.length === 0 ? (
                                <FadeIn delay={0.4}>
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">⭐</div>
                                        <p className="text-gray-500">You haven't rated any questions yet</p>
                                    </div>
                                </FadeIn>
                            ) : (
                                <StaggerChildren staggerDelay={0.08} initialDelay={0.4}>
                                    {history.ratings.map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <StarRating initialRating={item.rating} readonly size="sm" />
                                                <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">Question ID: {item.questionId}</p>
                                        </div>
                                    ))}
                                </StaggerChildren>
                            )}
                        </>
                    )}

                    {activeTab === 'reports' && (
                        <>
                            {history.reports.length === 0 ? (
                                <FadeIn delay={0.4}>
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">⚠️</div>
                                        <p className="text-gray-500">You haven't reported any questions</p>
                                    </div>
                                </FadeIn>
                            ) : (
                                <StaggerChildren staggerDelay={0.08} initialDelay={0.4}>
                                    {history.reports.map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                                                    {item.reason.replace(/_/g, ' ').toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">Question ID: {item.questionId}</p>
                                            {item.additionalComments && (
                                                <p className="text-sm text-gray-700 italic bg-white p-2 rounded">
                                                    "{item.additionalComments}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </StaggerChildren>
                            )}
                        </>
                    )}

                    {activeTab === 'comments' && (
                        <>
                            {history.comments.length === 0 ? (
                                <FadeIn delay={0.4}>
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">💬</div>
                                        <p className="text-gray-500">You haven't commented on any questions</p>
                                    </div>
                                </FadeIn>
                            ) : (
                                <StaggerChildren staggerDelay={0.08} initialDelay={0.4}>
                                    {history.comments.map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-500">Question ID: {item.questionId}</span>
                                                <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 bg-white p-3 rounded">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </StaggerChildren>
                            )}
                        </>
                    )}
                </div>

                {((activeTab === 'ratings' && history.ratings.length > 0) ||
                 (activeTab === 'reports' && history.reports.length > 0) ||
                 (activeTab === 'comments' && history.comments.length > 0)) && (
                    <SlideIn direction="up" delay={0.6}>
                        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-800">
                                <strong>Thank you for your feedback!</strong> Your contributions help improve the quiz quality for everyone.
                            </p>
                        </div>
                    </SlideIn>
                )}
            </div>
        </FadeIn>
    );
};

export default FeedbackHistory;