import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import BottomTabBar from './navigation/BottomTabBar';
import HamburgerMenu from './navigation/HamburgerMenu';
import DesktopNavigation from './navigation/DesktopNavigation';

const Layout = ({ children }) => {
  const { isMobile, closeHamburger } = useNavigation();
  const location = useLocation();

  useEffect(() => {
    closeHamburger();
  }, [location.pathname, closeHamburger]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeHamburger();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeHamburger]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DesktopNavigation />
      <HamburgerMenu />

      <main className={`
        transition-all duration-300 ease-in-out
        ${isMobile ? 'pb-20' : 'pb-4'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <BottomTabBar />
    </div>
  );
};

export default Layout;
