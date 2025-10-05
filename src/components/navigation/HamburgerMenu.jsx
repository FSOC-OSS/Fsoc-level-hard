import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import { useAuth } from "../../context/AuthContext";
import {
    HiX,
    HiHome,
    HiBookOpen,
    HiClock,
    HiUser,
    HiCog,
    HiQuestionMarkCircle,
    HiInformationCircle,
    HiShieldCheck,
    HiLogout,
    HiChevronRight,
} from "react-icons/hi";

const HamburgerMenu = () => {
    const { isHamburgerOpen, closeHamburger } = useNavigation();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);
    const backdropRef = useRef(null);

    const menuSections = [
        {
            title: "Navigation",
            items: [
                {
                    id: "home",
                    label: "Home",
                    icon: HiHome,
                    path: "/",
                    description: "Go to dashboard",
                },
                {
                    id: "quiz",
                    label: "Start Quiz",
                    icon: HiBookOpen,
                    path: "/",
                    description: "Begin a new quiz",
                },
                {
                    id: "history",
                    label: "Quiz History",
                    icon: HiClock,
                    path: "/bookmarks",
                    description: "View past quizzes",
                },
                {
                    id: "profile",
                    label: "Profile",
                    icon: HiUser,
                    path: "/profile",
                    description: "View your profile",
                },
                {
                    id: "badges",
                    label: "Badges & Achievements",
                    icon: HiUser,
                    path: "/badges",
                    description: "View your progress",
                },
            ],
        },
        {
            title: "Account",
            items: [
                {
                    id: "settings",
                    label: "Settings",
                    icon: HiCog,
                    path: "/settings/privacy",
                    description: "Privacy & preferences",
                },
            ],
        },
        {
            title: "Support",
            items: [
                {
                    id: "faq",
                    label: "FAQ",
                    icon: HiQuestionMarkCircle,
                    path: "/faq",
                    description: "Frequently asked questions",
                },
                {
                    id: "privacy",
                    label: "Cookie Policy",
                    icon: HiShieldCheck,
                    path: "/privacy/cookies",
                    description: "Privacy and cookies",
                },
                {
                    id: "about",
                    label: "About",
                    icon: HiInformationCircle,
                    action: "about",
                    description: "Learn more about the app",
                },
            ],
        },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isHamburgerOpen) {
                closeHamburger();
            }
        };

        const handleClickOutside = (e) => {
            if (backdropRef.current && e.target === backdropRef.current) {
                closeHamburger();
            }
        };

        if (isHamburgerOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("click", handleClickOutside);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("click", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isHamburgerOpen, closeHamburger]);

    useEffect(() => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            if (diff > 0 && menuRef.current) {
                const translateX = Math.min(diff, 300);
                menuRef.current.style.transform = `translateX(-${translateX}px)`;
            }
        };

        const handleTouchEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            if (diff > 100) {
                closeHamburger();
            } else if (menuRef.current) {
                menuRef.current.style.transform = "translateX(0)";
            }
        };

        if (isHamburgerOpen && menuRef.current) {
            const menu = menuRef.current;
            menu.addEventListener("touchstart", handleTouchStart);
            menu.addEventListener("touchmove", handleTouchMove);
            menu.addEventListener("touchend", handleTouchEnd);

            return () => {
                menu.removeEventListener("touchstart", handleTouchStart);
                menu.removeEventListener("touchmove", handleTouchMove);
                menu.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [isHamburgerOpen, closeHamburger]);

    const handleItemClick = (item) => {
        if (item.action === "about") {
            alert("Quiz App v1.0\nBuilt with React and Tailwind CSS");
        } else if (item.path) {
            navigate(item.path);
        }
        closeHamburger();
    };

    const handleLogout = () => {
        logout();
        closeHamburger();
        navigate("/auth");
    };

    if (!isHamburgerOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                ref={backdropRef}
                className={`
          absolute inset-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isHamburgerOpen ? "opacity-100" : "opacity-0"}
        `}
            />

            <div
                ref={menuRef}
                className={`
          absolute top-0 left-0 h-full w-80 max-w-[85vw]
          bg-white shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isHamburgerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    Q
                                </span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Quiz App
                                </h2>
                                {user && (
                                    <p className="text-sm text-gray-600">
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={closeHamburger}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Close menu"
                        >
                            <HiX className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        {menuSections.map((section) => (
                            <div key={section.title} className="mb-6">
                                <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {section.title}
                                </h3>
                                <nav>
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive =
                                            item.path === location.pathname;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() =>
                                                    handleItemClick(item)
                                                }
                                                className={`
                          w-full flex items-center px-4 py-3 text-left
                          transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
                          ${
                              isActive
                                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                                                role="menuitem"
                                            >
                                                <Icon
                                                    className={`w-5 h-5 mr-3 ${isActive ? "text-blue-700" : "text-gray-400"}`}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {item.label}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {item.description}
                                                    </div>
                                                </div>
                                                <HiChevronRight
                                                    className={`w-4 h-4 ${isActive ? "text-blue-700" : "text-gray-400"}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                            role="menuitem"
                        >
                            <HiLogout className="w-5 h-5 mr-3" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HamburgerMenu;
