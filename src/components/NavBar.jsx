import React, { useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const isActiveQuiz = location.pathname.startsWith("/quiz/active/");

  const handleNavClick = useCallback((e) => {
    if (!isActiveQuiz) return;
    const ok = window.confirm("Leave active quiz? Your progress might be lost.");
    if (!ok) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [isActiveQuiz]);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-purple-600 text-white" : "text-gray-200 hover:bg-purple-500/30"
    }`;

  return (
    <nav className="bg-purple-700 text-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-4">
            <NavLink to="/" className="font-bold tracking-wide" onClick={handleNavClick}>Quiz App</NavLink>
            <div className="hidden sm:flex gap-2">
              <NavLink to="/" className={linkClass} end onClick={handleNavClick}>
                Home
              </NavLink>
              <NavLink to="/bookmarks" className={linkClass} onClick={handleNavClick}>
                Bookmarks
              </NavLink>
              <NavLink to="/badges" className={linkClass} onClick={handleNavClick}>
                Badges
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
