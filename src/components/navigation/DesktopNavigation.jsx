import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import { useAuth } from "../../context/AuthContext";
import {
    HiHome,
    HiBookOpen,
    HiClock,
    HiUser,
    HiCog,
    HiQuestionMarkCircle,
    HiInformationCircle,
    HiShieldCheck,
    HiLogout,
    HiChevronDown,
    HiBars3,
} from "react-icons/hi2";

const DesktopNavigation = () => {
    const { isDesktop, isTablet, toggleHamburger } = useNavigation();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const navigationItems = [
        {
            id: "home",
            label: "Home",
            icon: HiHome,
            path: "/",
            description: "Dashboard",
        },
        {
            id: "quiz",
            label: "Quiz",
            icon: HiBookOpen,
            path: "/",
            description: "Start Quiz",
        },
        {
            id: "history",
            label: "History",
            icon: HiClock,
            path: "/bookmarks",
            description: "Quiz History",
        },
        {
            id: "profile",
            label: "Profile",
            icon: HiUser,
            path: "/profile",
            description: "Profile",
        },
        {
            id: "badges",
            label: "Badges",
            icon: HiUser,
            path: "/badges",
            description: "Achievements",
        },
    ];

    const profileMenuItems = [
        {
            id: "settings",
            label: "Settings",
            icon: HiCog,
            path: "/settings/privacy",
        },
        {
            id: "faq",
            label: "FAQ",
            icon: HiQuestionMarkCircle,
            path: "/faq",
        },
        {
            id: "privacy",
            label: "Privacy",
            icon: HiShieldCheck,
            path: "/privacy/cookies",
        },
        {
            id: "about",
            label: "About",
            icon: HiInformationCircle,
            action: "about",
        },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".profile-dropdown")) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleProfileMenuClick = (item) => {
        if (item.action === "about") {
            alert("Quiz App v1.0\nBuilt with React and Tailwind CSS");
        } else if (item.path) {
            navigate(item.path);
        }
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/auth");
        setIsProfileDropdownOpen(false);
    };

    if (!isDesktop && !isTablet) return null;

    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    Q
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Quiz App
                                </h1>
                            </div>
                        </div>

                        {isDesktop && (
                            <nav className="hidden lg:flex space-x-1">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        location.pathname === item.path;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                handleNavigation(item.path)
                                            }
                                            className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        ${
                            isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                                            aria-label={`Navigate to ${item.description}`}
                                        >
                                            <Icon className="w-5 h-5 mr-2" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        )}

                        {isTablet && (
                            <button
                                onClick={toggleHamburger}
                                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Open navigation menu"
                            >
                                <HiBars3 className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <nav className="hidden lg:flex items-center space-x-6">
                            <div className="text-sm">
                                <span className="text-gray-600">
                                    Welcome back,
                                </span>
                                <span className="font-medium text-gray-900 ml-1">
                                    {user?.email?.split("@")[0] || "User"}
                                </span>
                            </div>
                        </nav>

                        <div className="relative profile-dropdown">
                            <button
                                onClick={() =>
                                    setIsProfileDropdownOpen(
                                        !isProfileDropdownOpen,
                                    )
                                }
                                className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Open profile menu"
                                aria-expanded={isProfileDropdownOpen}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.email?.charAt(0).toUpperCase() ||
                                            "U"}
                                    </span>
                                </div>
                                <HiChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isProfileDropdownOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.email}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Quiz Participant
                                        </p>
                                    </div>

                                    <div className="py-2">
                                        {profileMenuItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() =>
                                                        handleProfileMenuClick(
                                                            item,
                                                        )
                                                    }
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                                                >
                                                    <Icon className="w-4 h-4 mr-3 text-gray-400" />
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-gray-100 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:bg-red-50"
                                        >
                                            <HiLogout className="w-4 h-4 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {location.pathname !== "/" && (
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-2 py-2 text-sm">
                            <button
                                onClick={() => navigate("/")}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                Home
                            </button>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600 capitalize">
                                {location.pathname.slice(1) || "Dashboard"}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default DesktopNavigation;
