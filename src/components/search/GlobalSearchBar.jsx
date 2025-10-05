import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, TrendingUp, Star } from "lucide-react";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import { useSearch } from "../../hooks/useSearch";

const GlobalSearchBar = ({ isExpanded = false, onToggle, className = "" }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const { searchHistory, addSearch, clearHistory, removeSearch } =
        useSearchHistory();
    const { results, suggestions, loading, search, clearResults } = useSearch();

    const handleInputChange = useCallback(
        (e) => {
            const value = e.target.value;
            setQuery(value);
            setSelectedIndex(-1);

            if (value.trim().length > 0) {
                search(value);
                setShowSuggestions(true);
            } else {
                clearResults();
                setShowSuggestions(searchHistory.length > 0);
            }
        },
        [search, clearResults, searchHistory.length],
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (query.trim()) {
                addSearch(query.trim());
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
                setShowSuggestions(false);
            }
        },
        [query, addSearch, navigate],
    );

    const handleSuggestionClick = useCallback(
        (suggestion) => {
            setQuery(suggestion);
            addSearch(suggestion);
            navigate(`/search?q=${encodeURIComponent(suggestion)}`);
            setIsOpen(false);
            setShowSuggestions(false);
        },
        [addSearch, navigate],
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (!showSuggestions) return;

            const items = query.trim() ? suggestions : searchHistory;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        Math.min(prev + 1, items.length - 1),
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, -1));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (selectedIndex >= 0 && items[selectedIndex]) {
                        const selectedItem = query.trim()
                            ? suggestions[selectedIndex]
                            : searchHistory[selectedIndex];
                        handleSuggestionClick(selectedItem);
                    } else {
                        handleSubmit(e);
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    setShowSuggestions(false);
                    inputRef.current?.blur();
                    break;
            }
        },
        [
            showSuggestions,
            query,
            suggestions,
            searchHistory,
            selectedIndex,
            handleSuggestionClick,
            handleSubmit,
        ],
    );

    const handleFocus = useCallback(() => {
        setIsOpen(true);
        setShowSuggestions(
            query.trim() ? suggestions.length > 0 : searchHistory.length > 0,
        );
        onToggle?.(true);
    }, [query, suggestions.length, searchHistory.length, onToggle]);

    const handleClear = useCallback(() => {
        setQuery("");
        clearResults();
        setShowSuggestions(searchHistory.length > 0);
        inputRef.current?.focus();
    }, [clearResults, searchHistory.length]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setShowSuggestions(false);
                onToggle?.(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onToggle]);

    useEffect(() => {
        const handleSlashKey = (e) => {
            if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const target = e.target;
                if (
                    target.tagName !== "INPUT" &&
                    target.tagName !== "TEXTAREA"
                ) {
                    e.preventDefault();
                    inputRef.current?.focus();
                }
            }
        };

        document.addEventListener("keydown", handleSlashKey);
        return () => document.removeEventListener("keydown", handleSlashKey);
    }, []);

    const renderSuggestions = () => {
        if (!showSuggestions || (!query.trim() && searchHistory.length === 0))
            return null;

        return (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg max-h-80 overflow-y-auto z-50">
                {!query.trim() && searchHistory.length > 0 && (
                    <>
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <span>Recent searches</span>
                            <button
                                onClick={clearHistory}
                                className="text-purple-600 hover:text-purple-700 text-xs"
                            >
                                Clear all
                            </button>
                        </div>
                        {searchHistory.map((item, index) => (
                            <div
                                key={index}
                                className={`px-4 py-3 cursor-pointer flex items-center justify-between group ${
                                    selectedIndex === index
                                        ? "bg-purple-50 dark:bg-purple-900/20"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                                onClick={() => handleSuggestionClick(item)}
                            >
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {item}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSearch(item);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </>
                )}

                {query.trim() && suggestions.length > 0 && (
                    <>
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            Suggestions
                        </div>
                        {suggestions.map((item, index) => (
                            <div
                                key={index}
                                className={`px-4 py-3 cursor-pointer flex items-center ${
                                    selectedIndex === index
                                        ? "bg-purple-50 dark:bg-purple-900/20"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                                onClick={() => handleSuggestionClick(item)}
                            >
                                <Search className="w-4 h-4 text-gray-400 mr-3" />
                                <span className="text-gray-900 dark:text-gray-100">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </>
                )}

                {query.trim() && suggestions.length === 0 && !loading && (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        No suggestions found
                    </div>
                )}

                {loading && (
                    <div className="px-4 py-3 text-center">
                        <div className="inline-flex items-center">
                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span className="text-gray-500 dark:text-gray-400">
                                Searching...
                            </span>
                        </div>
                    </div>
                )}

                {query.trim() && results.quizzes?.slice(0, 3).length > 0 && (
                    <>
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            Quick Results
                        </div>
                        {results.quizzes.slice(0, 3).map((quiz, index) => (
                            <div
                                key={`quiz-${index}`}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700"
                                onClick={() => navigate(`/quiz/${quiz.id}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {quiz.title}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {quiz.category}
                                        </div>
                                    </div>
                                    <div className="text-xs text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                                        Quiz
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="px-4 py-2 text-center">
                            <button
                                onClick={() =>
                                    navigate(
                                        `/search?q=${encodeURIComponent(query)}`,
                                    )
                                }
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                                View all results
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div
                    className={`relative flex items-center transition-all duration-200 ${
                        isExpanded || isOpen ? "w-full max-w-lg" : "w-64"
                    }`}
                >
                    <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        placeholder="Search quizzes, questions, categories..."
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        autoComplete="off"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <div className="absolute right-12 text-xs text-gray-400 hidden sm:block">
                        Press / to search
                    </div>
                </div>
            </form>

            {renderSuggestions()}
        </div>
    );
};

export default GlobalSearchBar;
