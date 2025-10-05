import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import {
    HiHome,
    HiBookOpen,
    HiClock,
    HiUser,
    HiDotsHorizontal,
} from "react-icons/hi";

const BottomTabBar = () => {
    const { isMobile, openHamburger } = useNavigation();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("home");

    const tabs = useMemo(
        () => [
            {
                id: "home",
                label: "Home",
                icon: HiHome,
                path: "/",
                ariaLabel: "Navigate to home",
            },
            {
                id: "quiz",
                label: "Quiz",
                icon: HiBookOpen,
                path: "/",
                ariaLabel: "Start quiz",
            },
            {
                id: "history",
                label: "History",
                icon: HiClock,
                path: "/bookmarks",
                ariaLabel: "View quiz history",
            },
            {
                id: "profile",
                label: "Profile",
                icon: HiUser,
                path: "/profile",
                ariaLabel: "View profile and badges",
            },
            {
                id: "more",
                label: "More",
                icon: HiDotsHorizontal,
                action: "menu",
                ariaLabel: "Open menu",
            },
        ],
        [],
    );

    useEffect(() => {
        const currentPath = location.pathname;
        const currentTab = tabs.find((tab) => tab.path === currentPath);
        if (currentTab) {
            setActiveTab(currentTab.id);
        }
    }, [location.pathname, tabs]);

    const handleTabClick = (tab) => {
        if (tab.action === "menu") {
            openHamburger();
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else {
            setActiveTab(tab.id);
            navigate(tab.path);
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    };

    if (!isMobile) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab)}
                            className={`
                flex flex-col items-center justify-center
                min-w-[44px] min-h-[44px] px-2 py-1
                rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                ${
                    isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }
              `}
                            aria-label={tab.ariaLabel}
                            role="tab"
                            aria-selected={isActive}
                        >
                            <Icon
                                className={`
                  w-6 h-6 transition-all duration-200
                  ${isActive ? "scale-110" : "scale-100"}
                `}
                            />
                            <span
                                className={`
                text-xs mt-1 font-medium transition-all duration-200
                ${isActive ? "text-blue-600" : "text-gray-600"}
              `}
                            >
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-blue-600 rounded-full"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomTabBar;
