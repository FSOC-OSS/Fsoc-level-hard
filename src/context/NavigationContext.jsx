import { createContext, useContext, useState, useEffect } from "react";

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            "useNavigation must be used within a NavigationProvider",
        );
    }
    return context;
};

const NavigationProvider = ({ children }) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
            setIsDesktop(width >= 1024);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const openHamburger = () => setIsHamburgerOpen(true);
    const closeHamburger = () => setIsHamburgerOpen(false);
    const toggleHamburger = () => setIsHamburgerOpen(!isHamburgerOpen);

    const value = {
        isHamburgerOpen,
        isMobile,
        isTablet,
        isDesktop,
        openHamburger,
        closeHamburger,
        toggleHamburger,
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

export { NavigationProvider };
export default NavigationProvider;
