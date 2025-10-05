# Adaptive Navigation System

This document describes the adaptive navigation system implemented for the Quiz App, providing responsive navigation with bottom tab bar for mobile and desktop navigation for larger screens.

## Overview

The navigation system automatically adapts based on screen size:
- **Mobile (< 768px)**: Bottom tab bar with hamburger menu
- **Tablet (768px - 1024px)**: Top navigation with hamburger menu
- **Desktop (> 1024px)**: Full top navigation bar with dropdown menu

## Components

### NavigationProvider (`src/context/NavigationContext.jsx`)
- Manages navigation state across the application
- Provides screen size detection and responsive breakpoints
- Handles hamburger menu open/close state

### Layout (`src/components/Layout.jsx`)
- Main layout wrapper that includes all navigation components
- Handles global navigation state and keyboard shortcuts
- Provides consistent spacing for mobile bottom navigation

### BottomTabBar (`src/components/navigation/BottomTabBar.jsx`)
- Fixed bottom navigation for mobile devices
- 5 primary navigation items with icons and labels
- Active state indicators with color and scale animations
- Haptic feedback support for mobile devices
- Safe area insets for notched devices

### HamburgerMenu (`src/components/navigation/HamburgerMenu.jsx`)
- Slide-in side drawer for additional navigation options
- Semi-transparent backdrop with click-to-close
- Swipe gesture support for closing
- Organized sections (Navigation, Account, Support)
- Touch-optimized with proper ARIA labels

### DesktopNavigation (`src/components/navigation/DesktopNavigation.jsx`)
- Top navigation bar for tablet and desktop
- Logo, navigation links, and user profile dropdown
- Breadcrumb navigation for deep pages
- Hover effects and smooth transitions

## Navigation Items

### Primary Navigation
- **Home**: Dashboard and main quiz interface
- **Quiz**: Start new quiz (same as Home)
- **History**: Quiz history and bookmarked questions
- **Profile**: User profile and statistics
- **More**: Opens hamburger menu (mobile only)

### Secondary Navigation (Hamburger Menu)
- **Badges & Achievements**: View earned badges
- **Settings**: Privacy settings and preferences
- **FAQ**: Frequently asked questions
- **Cookie Policy**: Privacy and cookie information
- **About**: App information

## Features

### Responsive Design
- Automatic layout switching based on screen size
- Smooth transitions between breakpoints
- No layout shift during resize
- Touch-optimized hit areas (minimum 44x44px)

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Focus visible indicators
- Screen reader announcements
- Semantic HTML structure

### Animations & Interactions
- Smooth slide-in animations for hamburger menu
- Scale animations for active tab indicators
- Backdrop blur effects
- Haptic feedback on mobile devices
- Hover effects for desktop

### Mobile Optimizations
- Safe area insets for notched devices
- Swipe gestures for menu dismissal
- Touch-optimized spacing
- Backdrop blur for iOS-style effects

## Usage

### Integration
The navigation is automatically integrated when wrapping components with the Layout:

```jsx
import Layout from './components/Layout';

<Layout>
  <YourPageComponent />
</Layout>
```

### Navigation Context
Access navigation state using the context:

```jsx
import { useNavigation } from './context/NavigationContext';

const { isMobile, isTablet, isDesktop, toggleHamburger } = useNavigation();
```

### Screen Size Detection
The system automatically detects screen size and provides responsive navigation:
- `isMobile`: true when screen width < 768px
- `isTablet`: true when screen width is 768px - 1024px  
- `isDesktop`: true when screen width > 1024px

## Styling

### CSS Classes
- `.safe-area-bottom`: Handles safe area insets for mobile devices
- `.glass-effect`: Glass morphism effect for modern UI
- `.touch-target`: Ensures minimum touch target size
- `.layout-transition`: Smooth layout transitions

### Animations
- `slideInLeft`: Hamburger menu entrance
- `fadeInBackdrop`: Backdrop fade-in effect
- `tabBounce`: Tab selection animation
- `dropdownSlide`: Profile dropdown animation

## Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Safe area insets for iOS devices
- Backdrop filter effects where supported
- Graceful degradation for older browsers

## Performance
- Lazy loading of navigation components
- Efficient re-rendering with proper React hooks
- Optimized animations with CSS transforms
- Minimal JavaScript for gesture handling