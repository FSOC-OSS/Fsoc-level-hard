import React, { useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import GlobalSearchBar from "./search/GlobalSearchBar";

const NavBar = () => {
    const [searchExpanded, setSearchExpanded] = useState(false);
    const location = useLocation();
    const isActiveQuiz = location.pathname.startsWith("/quiz/active/");

    const handleNavClick = useCallback(
        (e) => {
            if (!isActiveQuiz) return;
            const ok = window.confirm(
                "Leave active quiz? Your progress might be lost.",
            );
            if (!ok) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        [isActiveQuiz],
    );

    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${
            isActive
                ? "bg-purple-600 text-white"
                : "text-gray-200 hover:bg-purple-500/30"
        }`;

    return (
        <nav className="bg-purple-700 text-white shadow sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <NavLink
                            to="/"
                            className="font-bold tracking-wide text-lg"
                            onClick={handleNavClick}
                        >
                            Quiz App
                        </NavLink>
                        <div className="hidden lg:flex gap-2">
                            <NavLink
                                to="/"
                                className={linkClass}
                                end
                                onClick={handleNavClick}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/bookmarks"
                                className={linkClass}
                                onClick={handleNavClick}
                            >
                                Bookmarks
                            </NavLink>
                            <NavLink
                                to="/badges"
                                className={linkClass}
                                onClick={handleNavClick}
                            >
                                Badges
                            </NavLink>
                        </div>
                    </div>

                    <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                        <GlobalSearchBar
                            isExpanded={searchExpanded}
                            onToggle={setSearchExpanded}
                            className="w-full"
                        />
                    </div>

                    <div className="md:hidden">
                        <GlobalSearchBar
                            isExpanded={searchExpanded}
                            onToggle={setSearchExpanded}
                            className="w-64"
                        />
                    </div>
                </div>

                {/* Mobile navigation */}
                <div className="lg:hidden border-t border-purple-600 pt-2 pb-3">
                    <div className="flex space-x-2">
                        <NavLink
                            to="/"
                            className={linkClass}
                            end
                            onClick={handleNavClick}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/bookmarks"
                            className={linkClass}
                            onClick={handleNavClick}
                        >
                            Bookmarks
                        </NavLink>
                        <NavLink
                            to="/badges"
                            className={linkClass}
                            onClick={handleNavClick}
                        >
                            Badges
                        </NavLink>
                    </div>
                </div>

                {/* Mobile search bar */}
                <div className="md:hidden border-t border-purple-600 pt-3 pb-2">
                    <GlobalSearchBar
                        isExpanded={true}
                        onToggle={setSearchExpanded}
                        className="w-full"
                    />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
