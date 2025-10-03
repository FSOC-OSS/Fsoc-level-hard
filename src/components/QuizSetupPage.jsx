import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import BookmarkManager from "../utils/BookmarkManager";

const QuizSetupPage = ({ onStart }) => {
    const [numQuestions, setNumQuestions] = useState(10);
    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState("Easy");
    const [questionType, setQuestionType] = useState("multiple");
    const [categories, setCategories] = useState([]);
    const [questionTypes, setQuestionTypes] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [error, setError] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();

    const difficultyOptions = ["Easy", "Medium", "Hard"];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://opentdb.com/api_category.php");
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();
                setCategories(data.trivia_categories || []);
                if (data.trivia_categories?.length > 0) {
                    setCategory({
                        id: data.trivia_categories[0].id,
                        name: data.trivia_categories[0].name,
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setLoadingTypes(true);
        const types = [
            { value: "multiple", label: "Multiple Choice" },
            { value: "boolean", label: "True/False" },
        ];
        setQuestionTypes(types);
        setQuestionType(types[0].value);
        setLoadingTypes(false);
    }, []);

    const handleStartQuiz = () => {
        const preferences = {
            numQuestions,
            category,
            difficulty,
            questionType,
        };
        localStorage.setItem("quizPreferences", JSON.stringify(preferences));
        if (typeof onStart === "function") onStart();
        else navigate("/");
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
            <div className="w-full max-w-3xl">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-white relative top-[2px]"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65a.5.5 0 00.11-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.03 7.03 0 00-1.73-1l-.38-2.65A.495.495 0 0014 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.63.27-1.21.61-1.73 1l-2.49-1a.5.5 0 00-.61.22l-2 3.46c-.14.23-.1.54.11.64L4.57 11c-.04.32-.07.66-.07 1s.03.68.07 1l-2.11 1.65a.5.5 0 00-.11.64l2 3.46c.14.23.41.3.61.22l2.49-1c.52.39 1.1.73 1.73 1l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.63-.27 1.21-.61 1.73-1l2.49 1c.2.08.47.01.61-.22l2-3.46a.5.5 0 00-.11-.64L19.43 12.98zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                        </svg>
                        <h1 className="text-3xl font-semibold text-white tracking-wide">
                            Quiz Setup
                        </h1>
                    </div>
                    <p className="text-center text-purple-100 mb-10">
                        Configure your quiz preferences and get started!
                    </p>

                    {/* Number of Questions */}
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-3">
                            Number of Questions:{" "}
                            <span className="text-yellow-300">
                                {numQuestions}
                            </span>
                        </label>
                        <RangeSlider
                            value={numQuestions}
                            onChange={setNumQuestions}
                            min={5}
                            max={50}
                        />
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-3">
                            Category
                        </label>
                        {loadingCategories ? (
                            <div className="text-purple-200">
                                Loading categories...
                            </div>
                        ) : error ? (
                            <div className="text-red-400">{error}</div>
                        ) : (
                            <Dropdown
                                id="category"
                                value={category?.name || ""}
                                onChange={setCategory}
                                options={categories.map((c) => ({
                                    id: c.id,
                                    name: c.name,
                                }))}
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                renderLabel={(opt) => opt.name}
                            />
                        )}
                    </div>

                    {/* Difficulty */}
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-3">
                            Difficulty
                        </label>
                        <Dropdown
                            id="difficulty"
                            value={difficulty}
                            onChange={setDifficulty}
                            options={difficultyOptions}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                    </div>

                    {/* Question Type */}
                    <div className="mb-8">
                        <label className="block text-white font-medium mb-3">
                            Question Type
                        </label>
                        {loadingTypes ? (
                            <div className="text-purple-200">
                                Loading question types...
                            </div>
                        ) : (
                            <Dropdown
                                id="type"
                                value={
                                    questionTypes.find(
                                        (t) => t.value === questionType,
                                    )?.label || ""
                                }
                                onChange={(option) => {
                                    if (typeof option === "string") {
                                        const found = questionTypes.find(
                                            (t) => t.label === option,
                                        );
                                        if (found) setQuestionType(found.value);
                                    } else if (option?.value) {
                                        setQuestionType(option.value);
                                    }
                                }}
                                options={questionTypes}
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                renderLabel={(opt) => opt.label}
                            />
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={handleStartQuiz}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 py-4 rounded-xl font-semibold text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Start Quiz
                        </button>

                        <button
                            onClick={() => navigate("/badges")}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 py-4 px-12 rounded-xl text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                            title="View Achievements & Badges"
                        >
                            <FontAwesomeIcon
                                icon={faTrophy}
                                className="w-6 h-6"
                            />
                        </button>

                        <button
                            onClick={() => navigate("/bookmarks")}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 py-4 px-12 rounded-xl text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform relative"
                            title="View Bookmarked Questions"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            {BookmarkManager.getBookmarkCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {BookmarkManager.getBookmarkCount()}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Quick Settings */}
                    <QuickSettings
                        numQuestions={numQuestions}
                        category={category}
                        difficulty={difficulty}
                        questionType={questionType}
                    />
                </div>
            </div>
        </div>
    );
};

/* Sub-components */
const RangeSlider = ({ value, onChange, min, max }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return (
        <div className="relative">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, #facc15 0%, #facc15 ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`,
                }}
            />
            <div className="flex justify-between text-xs text-purple-200 mt-2">
                <span>{min}</span>
                <span>{max}</span>
            </div>
            <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: black;
          border: 3px solid #facc15;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: black;
          border: 3px solid #facc15;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

const Dropdown = ({
    id,
    value,
    onChange,
    options,
    openDropdown,
    setOpenDropdown,
    renderLabel,
}) => {
    const isOpen = openDropdown === id;
    return (
        <div className="relative">
            <button
                onClick={() => setOpenDropdown(isOpen ? null : id)}
                className="w-full bg-white/20 px-4 py-3 rounded-xl text-left flex items-center justify-between text-white hover:bg-white/30 transition"
            >
                <span>{value || "Select..."}</span>
                <svg
                    className={`w-5 h-5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white text-black rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                    {options.map((option, index) => {
                        const label = renderLabel
                            ? renderLabel(option)
                            : typeof option === "string"
                              ? option
                              : option.label ||
                                option.name ||
                                JSON.stringify(option);
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    onChange(option);
                                    setOpenDropdown(null);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-purple-100 transition"
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const QuickSettings = ({
    numQuestions,
    category,
    difficulty,
    questionType,
}) => {
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case "Easy":
                return "text-green-400 font-extrabold";
            case "Medium":
                return "text-yellow-400 font-extrabold";
            case "Hard":
                return "text-red-500 font-extrabold";
            default:
                return "text-white font-extrabold";
        }
    };

    const getShortType = (type) => (type === "multiple" ? "MC" : "TF");

    return (
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-5 gap-3 w-full max-w-5xl">
                {/* Questions */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-yellow-400">
                        {numQuestions}
                    </div>
                    <div className="text-sm font-semibold text-gray-100">
                        Questions
                    </div>
                </div>

                {/* Category */}
                <div className="col-span-2 bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                    <div className="text-lg font-bold text-amber-300">
                        {category?.name || ""}
                    </div>
                    <div className="text-sm font-semibold text-gray-100">
                        Category
                    </div>
                </div>

                {/* Difficulty */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                    <div
                        className={`text-lg ${getDifficultyColor(difficulty)}`}
                    >
                        {difficulty}
                    </div>
                    <div className="text-sm font-semibold text-gray-100">
                        Difficulty
                    </div>
                </div>

                {/* Type */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                    <div className="text-lg font-bold text-green-300">
                        {getShortType(questionType)}
                    </div>
                    <div className="text-sm font-semibold text-gray-100">
                        Type
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizSetupPage;
