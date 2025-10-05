import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Search,
    Grid,
    List,
    Filter,
    ChevronDown,
    Clock,
    Star,
    TrendingUp,
    BookOpen,
    Users,
    Tag,
    X,
} from "lucide-react";
import SearchFilters from "../components/search/SearchFilters";
import SearchDashboard from "../components/search/SearchDashboard";
import { useSearch } from "../hooks/useSearch";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";

    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("relevance");
    const [viewMode, setViewMode] = useState("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        categories: [],
        difficulty: [],
        dateRange: {},
        scoreRange: {},
        durationRange: {},
        status: [],
        tags: [],
    });

    const { results, loading, search, totalResults } = useSearch();
    const itemsPerPage = 12;

    useEffect(() => {
        if (query) {
            search(
                query,
                filters,
                sortBy,
                (currentPage - 1) * itemsPerPage,
                itemsPerPage,
            );
        }
    }, [query, filters, sortBy, currentPage, search]);

    // Show dashboard when no query
    if (!query) {
        return <SearchDashboard />;
    }

    const tabs = [
        { id: "all", label: "All", count: totalResults?.all || 0 },
        { id: "quizzes", label: "Quizzes", count: totalResults?.quizzes || 0 },
        {
            id: "questions",
            label: "Questions",
            count: totalResults?.questions || 0,
        },
        {
            id: "categories",
            label: "Categories",
            count: totalResults?.categories || 0,
        },
        { id: "users", label: "Users", count: totalResults?.users || 0 },
    ];

    const sortOptions = [
        { value: "relevance", label: "Relevance" },
        { value: "date_desc", label: "Newest First" },
        { value: "date_asc", label: "Oldest First" },
        { value: "score_desc", label: "Highest Score" },
        { value: "score_asc", label: "Lowest Score" },
        { value: "difficulty_asc", label: "Easiest First" },
        { value: "difficulty_desc", label: "Hardest First" },
    ];

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            categories: [],
            difficulty: [],
            dateRange: {},
            scoreRange: {},
            durationRange: {},
            status: [],
            tags: [],
        });
        setCurrentPage(1);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.categories?.length > 0) count++;
        if (filters.difficulty?.length > 0) count++;
        if (filters.dateRange?.from || filters.dateRange?.to) count++;
        if (
            filters.scoreRange?.min !== undefined ||
            filters.scoreRange?.max !== undefined
        )
            count++;
        if (
            filters.durationRange?.min !== undefined ||
            filters.durationRange?.max !== undefined
        )
            count++;
        if (filters.status?.length > 0) count++;
        if (filters.tags?.length > 0) count++;
        return count;
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
                    {part}
                </mark>
            ) : (
                part
            ),
        );
    };

    const renderQuizCard = (quiz, index) => (
        <div
            key={`quiz-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
        >
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {highlightText(quiz.title || "Untitled Quiz", query)}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                            {quiz.rating || "4.5"}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {highlightText(
                        quiz.description || "No description available",
                        query,
                    )}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                        {quiz.category}
                    </span>
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {quiz.questionCount || 10} questions
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {quiz.duration || 15} min
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span
                        className={`text-xs px-2 py-1 rounded ${
                            quiz.difficulty === "Easy"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : quiz.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                    >
                        {quiz.difficulty}
                    </span>
                    {quiz.tags && (
                        <div className="flex space-x-1">
                            {quiz.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span
                                    key={tagIndex}
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderQuestionCard = (question, index) => (
        <div
            key={`question-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow p-4"
        >
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {highlightText(question.text || "Question text", query)}
            </h3>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs">
                    {question.category}
                </span>
                <span
                    className={`text-xs px-2 py-1 rounded ${
                        question.difficulty === "Easy"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : question.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                >
                    {question.difficulty}
                </span>
            </div>
        </div>
    );

    const renderCategoryCard = (category, index) => (
        <div
            key={`category-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow p-4 cursor-pointer"
            onClick={() => navigate(`/category/${category.id}`)}
        >
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {highlightText(category.name, query)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {category.questionCount || 0} questions available
            </p>
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                <Tag className="w-3 h-3 mr-1" />
                Category
            </div>
        </div>
    );

    const renderUserCard = (user, index) => (
        <div
            key={`user-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow p-4 cursor-pointer"
            onClick={() => navigate(`/user/${user.id}`)}
        >
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {highlightText(user.name || "Anonymous User", query)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.quizCount || 0} quizzes completed
                    </p>
                </div>
            </div>
        </div>
    );

    const renderResults = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                            Searching...
                        </span>
                    </div>
                </div>
            );
        }

        const currentResults =
            activeTab === "all"
                ? [
                      ...(results.quizzes || []).map((item) => ({
                          ...item,
                          type: "quiz",
                      })),
                      ...(results.questions || []).map((item) => ({
                          ...item,
                          type: "question",
                      })),
                      ...(results.categories || []).map((item) => ({
                          ...item,
                          type: "category",
                      })),
                      ...(results.users || []).map((item) => ({
                          ...item,
                          type: "user",
                      })),
                  ]
                : results[activeTab] || [];

        if (currentResults.length === 0) {
            return (
                <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No results found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        We couldn't find anything matching "{query}"
                    </p>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Try:
                        </p>
                        <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <li>• Checking your spelling</li>
                            <li>• Using different keywords</li>
                            <li>• Adjusting your filters</li>
                            <li>• Browsing categories instead</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => navigate("/categories")}
                        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Browse Categories
                    </button>
                </div>
            );
        }

        return (
            <div
                className={`grid gap-4 ${
                    viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                }`}
            >
                {currentResults.map((item, index) => {
                    if (activeTab === "all") {
                        switch (item.type) {
                            case "quiz":
                                return renderQuizCard(item, index);
                            case "question":
                                return renderQuestionCard(item, index);
                            case "category":
                                return renderCategoryCard(item, index);
                            case "user":
                                return renderUserCard(item, index);
                            default:
                                return null;
                        }
                    } else {
                        switch (activeTab) {
                            case "quizzes":
                                return renderQuizCard(item, index);
                            case "questions":
                                return renderQuestionCard(item, index);
                            case "categories":
                                return renderCategoryCard(item, index);
                            case "users":
                                return renderUserCard(item, index);
                            default:
                                return null;
                        }
                    }
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Search Results
                    </h1>
                    {query && (
                        <p className="text-gray-600 dark:text-gray-400">
                            Results for "{query}"
                            {totalResults?.all > 0 && (
                                <span className="ml-1">
                                    ({totalResults.all} total)
                                </span>
                            )}
                        </p>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/4">
                        <SearchFilters
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onClear={handleClearFilters}
                            isOpen={showFilters}
                            onToggle={() => setShowFilters(!showFilters)}
                        />
                    </div>

                    <div className="lg:w-3/4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav
                                    className="flex space-x-8 px-6"
                                    aria-label="Tabs"
                                >
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setCurrentPage(1);
                                            }}
                                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === tab.id
                                                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                            }`}
                                        >
                                            {tab.label}
                                            {tab.count > 0 && (
                                                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">
                                                    {tab.count}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="lg:hidden">
                                            <button
                                                onClick={() =>
                                                    setShowFilters(!showFilters)
                                                }
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                                            >
                                                <Filter className="w-4 h-4" />
                                                Filters
                                                {getActiveFilterCount() > 0 && (
                                                    <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
                                                        {getActiveFilterCount()}
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {getActiveFilterCount() > 0 && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {getActiveFilterCount()}{" "}
                                                    filter
                                                    {getActiveFilterCount() > 1
                                                        ? "s"
                                                        : ""}{" "}
                                                    applied
                                                </span>
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="text-purple-600 hover:text-purple-700 text-sm"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm text-gray-600 dark:text-gray-400">
                                                Sort by:
                                            </label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) =>
                                                    setSortBy(e.target.value)
                                                }
                                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                {sortOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                                            <button
                                                onClick={() =>
                                                    setViewMode("grid")
                                                }
                                                className={`p-1.5 rounded ${
                                                    viewMode === "grid"
                                                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                }`}
                                            >
                                                <Grid className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setViewMode("list")
                                                }
                                                className={`p-1.5 rounded ${
                                                    viewMode === "list"
                                                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                }`}
                                            >
                                                <List className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {renderResults()}

                                {!loading &&
                                    totalResults?.[activeTab] >
                                        itemsPerPage && (
                                        <div className="flex items-center justify-center mt-8">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            Math.max(
                                                                1,
                                                                currentPage - 1,
                                                            ),
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Page {currentPage} of{" "}
                                                    {Math.ceil(
                                                        (totalResults[
                                                            activeTab
                                                        ] || 0) / itemsPerPage,
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            currentPage + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage >=
                                                        Math.ceil(
                                                            (totalResults[
                                                                activeTab
                                                            ] || 0) /
                                                                itemsPerPage,
                                                        )
                                                    }
                                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
