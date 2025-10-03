import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- Mock Data (for demonstration without a real API) ---
// Added sampleQuestions to each category object for the preview feature.
const MOCK_CATEGORIES = [
  { id: 1, name: 'History', description: 'Explore pivotal moments, ancient civilizations, and influential figures from the past.', imageUrl: 'https://placehold.co/600x400/6366f1/FFFFFF?text=History', questionCount: 25, difficulties: ['Easy', 'Hard'], avgTime: 5, userBestScore: 88, popularity: 0.8, dateAdded: '2025-09-15', sampleQuestions: ['Who was the first Roman Emperor?', 'The Magna Carta was signed in which year?'] },
  { id: 2, name: 'Science', description: 'Test your knowledge of biology, chemistry, physics, and the natural world around you.', imageUrl: 'https://placehold.co/600x400/22c55e/FFFFFF?text=Science', questionCount: 42, difficulties: ['Easy', 'Medium', 'Hard'], avgTime: 7, userBestScore: null, popularity: 0.9, dateAdded: '2025-08-20', sampleQuestions: ['What is the powerhouse of the cell?', 'What is the speed of light?'] },
  { id: 3, name: 'Cinema', description: 'From silent films and classic Hollywood to modern blockbusters and international masterpieces.', imageUrl: 'https://placehold.co/600x400/f97316/FFFFFF?text=Cinema', questionCount: 38, difficulties: ['Medium'], avgTime: 6, userBestScore: 92, popularity: 0.85, dateAdded: '2025-09-01', sampleQuestions: ['Who directed the film "Pulp Fiction"?', 'Which film won the first Oscar for Best Picture?'] },
  { id: 4, name: 'Technology', description: 'The world of code, gadgets, artificial intelligence, and groundbreaking innovation.', imageUrl: 'https://placehold.co/600x400/3b82f6/FFFFFF?text=Tech', questionCount: 31, difficulties: ['Medium', 'Hard'], avgTime: 8, userBestScore: 76, popularity: 0.7, dateAdded: '2025-10-01', sampleQuestions: ['What does "HTTP" stand for?', 'Who is considered the father of the computer?'] },
  { id: 5, name: 'Literature', description: 'Classic novels, timeless poetry, and the literary giants who wrote them.', imageUrl: 'https://placehold.co/600x400/78716c/FFFFFF?text=Literature', questionCount: 29, difficulties: ['Hard'], avgTime: 9, userBestScore: null, popularity: 0.6, dateAdded: '2025-07-10', sampleQuestions: ['Who wrote "Pride and Prejudice"?', 'What is the first line of "Moby Dick"?'] },
  { id: 6, name: 'Geography', description: 'Discover the world, its countries, continents, oceans, and famous capitals.', imageUrl: 'https://placehold.co/600x400/14b8a6/FFFFFF?text=Geography', questionCount: 50, difficulties: ['Easy', 'Medium'], avgTime: 5, userBestScore: 95, popularity: 0.95, dateAdded: '2025-10-03', sampleQuestions: ['What is the capital of Australia?', 'Which river is the longest in the world?'] },
  { id: 7, name: 'Music', description: 'From classical composers and jazz legends to rock icons and modern pop stars.', imageUrl: 'https://placehold.co/600x400/ec4899/FFFFFF?text=Music', questionCount: 35, difficulties: ['Easy', 'Medium', 'Hard'], avgTime: 6, userBestScore: null, popularity: 0.75, dateAdded: '2025-08-05', sampleQuestions: ['Who is known as the "King of Pop"?', 'How many strings does a violin have?'] },
  { id: 8, name: 'Art', description: 'Iconic paintings, famous sculptures, and the influential art movements that defined history.', imageUrl: 'https://placehold.co/600x400/d946ef/FFFFFF?text=Art', questionCount: 21, difficulties: ['Medium'], avgTime: 4, userBestScore: 81, popularity: 0.5, dateAdded: '2025-09-18', sampleQuestions: ['Who painted the Mona Lisa?', 'What is the style of art of Salvador Dalí?'] },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// --- Sub-Component: FeaturedSection ---
const FeaturedSection = ({ title, categories }) => {
    if (!categories || categories.length === 0) return null;
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        const el = scrollContainerRef.current;
        if (el) {
            const isScrollable = el.scrollWidth > el.clientWidth;
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth);
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            checkScrollability();
            el.addEventListener('scroll', checkScrollability);
            window.addEventListener('resize', checkScrollability);
            return () => { el.removeEventListener('scroll', checkScrollability); window.removeEventListener('resize', checkScrollability); };
        }
    }, [categories]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="featured-section">
            <h2 className="section-title">{title}</h2>
            <div className="carousel-wrapper">
                <div className="featured-grid-container" ref={scrollContainerRef}>
                    <div className="featured-grid">{categories.map(category => <CategoryCard key={category.id} category={category} />)}</div>
                </div>
                {canScrollLeft && <button className="carousel-btn prev" onClick={() => scroll('left')} aria-label="Scroll left"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg></button>}
                {canScrollRight && <button className="carousel-btn next" onClick={() => scroll('right')} aria-label="Scroll right"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></button>}
            </div>
        </section>
    );
};

// --- Sub-Component: FilterControls ---
const FilterControls = ({ searchTerm, setSearchTerm, selectedDifficulties, setSelectedDifficulties, sortBy, setSortBy, clearFilters, resultCount }) => {
    const handleDifficultyChange = (difficulty) => setSelectedDifficulties(prev => prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]);
    return (
        <div className="filter-controls">
            <div className="search-bar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg><input type="text" placeholder="Search all categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="difficulty-filters">{DIFFICULTIES.map(d => (<button key={d} className={`difficulty-btn ${selectedDifficulties.includes(d) ? 'active' : ''}`} onClick={() => handleDifficultyChange(d)}>{d}</button>))}</div>
            <div className="sort-dropdown"><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="popularity">Most Popular</option><option value="dateAdded">Recently Added</option><option value="az">A-Z</option></select></div>
            <button className="clear-btn" onClick={clearFilters}>Clear</button>
            <div className="result-count">{resultCount} results</div>
        </div>
    );
};

// --- Sub-Component: CategoryCard ---
const CategoryCard = ({ category }) => {
  const handleCardClick = (e, action) => {
    e.stopPropagation(); // Prevents multiple alerts if clicking on a button inside the card
    alert(`${action} a ${category.name} quiz!`);
  };
  const handleKeyDown = (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleCardClick(event, 'Starting'); } };

  return (
    <div className="category-card" onClick={(e) => handleCardClick(e, 'Starting')} onKeyDown={handleKeyDown} role="button" tabIndex="0" aria-label={`Start a quiz on ${category.name}`}>
      <img src={category.imageUrl} alt={`${category.name} category`} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{category.name}</h3><p className="card-description">{category.description}</p>
        <div className="card-details-hover">
            <div className="hover-section"><h4>Available Difficulties:</h4><div className="difficulty-tags">{category.difficulties.map(level => <span key={level} className={`difficulty-tag ${level.toLowerCase()}`}>{level}</span>)}</div></div>
            <div className="hover-section"><h4>Stats:</h4><div className="stats-grid"><div className="stat-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg><span>{category.avgTime} min avg.</span></div>{category.userBestScore !== null && (<div className="stat-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 0 1-1.133 2.196L7.6 11.496V16a.5.5 0 0 1-1.2.4L4.8 13.9a.5.5 0 0 1-.3-.4V11.5L2.669 4.232A3 3 0 0 1 2.534 2.036C2.512 1.55 2.5 1.038 2.5.5zm.092 1.01A2 2 0 0 0 4.044 3.5l1.827 5.219L7.5 12.443V15.5a.5.5 0 0 0 .75.45l.223-.134.45-.268.45-.268.224-.135V12.443l1.669-3.724 1.827-5.22a2 2 0 0 0 1.45-2.487C13.56 1.07 13.5 1 13.5 1H3.092z"/></svg><span>Best: {category.userBestScore}%</span></div>)}</div></div>
            <div className="hover-section"><h4>Sample Questions:</h4><ul className="sample-questions-list">{category.sampleQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
            <div className="hover-actions">
              <button className="quick-start-btn" onClick={(e) => handleCardClick(e, 'Quick Starting')}>Quick Start</button>
              <button className="learn-more-btn" onClick={(e) => handleCardClick(e, 'Learning more about')}>Learn More</button>
            </div>
        </div>
        <div className="card-footer"><span className="question-count">{category.questionCount} Questions</span><div className="card-button">Start Quiz<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></div></div>
      </div>
    </div>
  );
};

// --- Sub-Component: SkeletonCard ---
const SkeletonCard = () => (<div className="category-card skeleton"><div className="skeleton-image"></div><div className="skeleton-content"><div className="skeleton-title"></div><div className="skeleton-desc"></div><div className="skeleton-desc short"></div><div className="skeleton-footer"></div></div></div>);

// --- Main Page Component: CategoriesPage ---
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const timer = setTimeout(() => {
      try { setCategories(MOCK_CATEGORIES); setIsLoading(false); } catch (err) { setError('Failed to load categories.'); setIsLoading(false); }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const clearFilters = () => { setSearchTerm(''); setSelectedDifficulties([]); setSortBy('popularity'); };

  const popularCategories = useMemo(() => [...categories].sort((a, b) => b.popularity - a.popularity).slice(0, 8), [categories]);
  const newCategories = useMemo(() => [...categories].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 8), [categories]);
  const recentCategories = useMemo(() => categories.filter(c => c.userBestScore !== null).slice(0, 8), [categories]);
  const recommendedCategories = useMemo(() => categories.filter(c => c.userBestScore === null).sort((a,b) => b.popularity - a.popularity).slice(0, 8), [categories]);

  const filteredAndSortedCategories = useMemo(() => {
    return categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedDifficulties.length === 0 || selectedDifficulties.some(d => category.difficulties.includes(d)))).sort((a, b) => { switch (sortBy) { case 'az': return a.name.localeCompare(b.name); case 'dateAdded': return new Date(b.dateAdded) - new Date(a.dateAdded); case 'popularity': default: return b.popularity - a.popularity; } });
  }, [categories, searchTerm, selectedDifficulties, sortBy]);

  if (error) { return <p className="error-message full-page">{error}</p>; }

  return (
    <div className={`categories-page-container ${!isLoading ? 'fade-in' : ''}`}>
        <header className="page-header"><h1 className="page-title">Explore Quiz Categories</h1><p className="page-subtitle">Choose a topic and test your knowledge!</p></header>
        
        {/* Featured sections will only render their content once loading is complete */}
        <div className="featured-sections-wrapper">
          {isLoading ? (
              <><div className="skeleton-section-title"></div><div className="featured-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></>
          ) : (
              <>
                  <FeaturedSection title="Popular Categories" categories={popularCategories} />
                  <FeaturedSection title="Your Recent" categories={recentCategories} />
                  <FeaturedSection title="New Categories" categories={newCategories} />
                  <FeaturedSection title="Recommended For You" categories={recommendedCategories} />
              </>
          )}
        </div>

        <section className="all-categories-section">
            <h2 className="section-title">All Categories</h2>
            <FilterControls searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedDifficulties={selectedDifficulties} setSelectedDifficulties={setSelectedDifficulties} sortBy={sortBy} setSortBy={setSortBy} clearFilters={clearFilters} resultCount={filteredAndSortedCategories.length} />
            <main className="category-grid">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
                ) : (
                    filteredAndSortedCategories.length > 0 
                        ? filteredAndSortedCategories.map(category => <CategoryCard key={category.id} category={category} />) 
                        : <p className="info-message">No categories match your filters.</p>
                )}
            </main>
        </section>
    </div>
  );
};

// --- App Component (Root of the application) ---
export default function App() {
  return (<><style>{`
    :root {
      --primary-color: #6366f1; --background-color: #f8fafc; --card-background: #ffffff; --text-color: #334155; --subtle-text: #64748b; --border-color: #e2e8f0; --shadow-color: rgba(99, 102, 241, 0.1); --skeleton-color: #e2e8f0; --easy-bg: #dcfce7; --easy-text: #166534; --medium-bg: #fef9c3; --medium-text: #854d0e; --hard-bg: #fee2e2; --hard-text: #991b1b;
    }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: var(--background-color); color: var(--text-color); }
    
    /* --- Smooth Transition Animation --- */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .fade-in { animation: fadeIn 0.5s ease-in-out forwards; }

    .categories-page-container { padding: 2rem 1rem; max-width: 1200px; margin: 0 auto; }
    .page-header { text-align: center; margin-bottom: 2rem; }
    .page-title { font-size: clamp(2rem, 5vw, 2.5rem); font-weight: 800; color: var(--text-color); margin-bottom: 0.5rem; }
    .page-subtitle { font-size: 1.125rem; color: var(--subtle-text); max-width: 500px; margin: 0 auto; }
    
    .featured-section { margin-bottom: 3rem; }
    .section-title { font-size: 1.75rem; font-weight: 700; color: var(--text-color); margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; }
    .carousel-wrapper { position: relative; }
    .featured-grid-container { display: flex; overflow-x: auto; scroll-behavior: smooth; padding-bottom: 1rem; scrollbar-width: none; }
    .featured-grid-container::-webkit-scrollbar { display: none; }
    .featured-grid { display: flex; gap: 1.5rem; }
    .featured-grid .category-card { width: 280px; flex-shrink: 0; }
    .carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-color); background-color: rgba(255,255,255,0.8); backdrop-filter: blur(4px); cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.2s ease; }
    .carousel-btn:hover { background-color: var(--primary-color); color: white; }
    .carousel-btn.prev { left: -20px; }
    .carousel-btn.next { right: -20px; }

    .all-categories-section { margin-top: 3rem; }
    .filter-controls { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; padding: 1rem; background-color: var(--card-background); border-radius: 0.75rem; border: 1px solid var(--border-color); margin-bottom: 2.5rem; }
    .search-bar { position: relative; flex-grow: 1; min-width: 200px; }
    .search-bar svg { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--subtle-text); }
    .search-bar input { width: 100%; padding: 0.6rem 0.75rem 0.6rem 2.25rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; background-color: var(--background-color); }
    .difficulty-filters { display: flex; gap: 0.5rem; }
    .difficulty-btn { padding: 0.5rem 1rem; border: 1px solid var(--border-color); background-color: var(--card-background); border-radius: 9999px; cursor: pointer; transition: all 0.2s ease; }
    .difficulty-btn.active { color: white; background-color: var(--primary-color); border-color: var(--primary-color); }
    .sort-dropdown select { padding: 0.6rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; background-color: var(--card-background); }
    .clear-btn { padding: 0.6rem 1rem; border: none; background: none; color: var(--primary-color); font-weight: 600; cursor: pointer; }
    .result-count { font-size: 0.9rem; color: var(--subtle-text); margin-left: auto; }
    
    .category-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(1, 1fr); }
    @media (min-width: 640px) { .category-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 768px) { .category-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1024px) { .category-grid { grid-template-columns: repeat(4, 1fr); } }

    .error-message, .info-message { grid-column: 1 / -1; text-align: center; padding: 2rem; font-size: 1.1rem; color: var(--subtle-text); background-color: var(--card-background); border-radius: 0.75rem; }
    .error-message.full-page { border-radius: 0.75rem; }
    
    .category-card { background-color: var(--card-background); border: 1px solid var(--border-color); border-radius: 0.75rem; overflow: hidden; box-shadow: 0 4px 6px -1px var(--shadow-color), 0 2px 4px -2px var(--shadow-color); transition: transform 0.3s ease, box-shadow 0.3s ease, height 0.4s ease; display: flex; flex-direction: column; cursor: pointer; outline-color: var(--primary-color); }
    .category-card:hover { transform: translateY(-8px); box-shadow: 0 10px 15px -3px var(--shadow-color), 0 4px 6px -4px var(--shadow-color); }
    .card-image { width: 100%; height: 160px; object-fit: cover; display: block; }
    .card-content { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; position: relative; }
    .card-title { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 600; color: var(--text-color); }
    .card-description { color: var(--subtle-text); font-size: 0.9rem; line-height: 1.5; overflow: hidden; transition: opacity 0.3s ease, max-height 0.4s ease; max-height: 5.4rem; opacity: 1; }
    .card-details-hover { display: flex; flex-direction: column; gap: 0.75rem; overflow: hidden; transition: opacity 0.3s ease, max-height 0.4s ease, margin-top 0.4s ease; max-height: 0; opacity: 0; margin-top: 0; }
    .category-card:hover .card-description { max-height: 0; opacity: 0; }
    .category-card:hover .card-details-hover { max-height: 20rem; opacity: 1; margin-top: 0.75rem; }
    .hover-section h4 { margin: 0 0 0.5rem; font-size: 0.8rem; color: var(--subtle-text); font-weight: 500; text-transform: uppercase; }
    .difficulty-tags, .stats-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .difficulty-tag { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 9999px; }
    .difficulty-tag.easy { background-color: var(--easy-bg); color: var(--easy-text); } .difficulty-tag.medium { background-color: var(--medium-bg); color: var(--medium-text); } .difficulty-tag.hard { background-color: var(--hard-bg); color: var(--hard-text); }
    .stat-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--subtle-text); font-weight: 500; }
    .stat-item svg { width: 14px; height: 14px; color: var(--subtle-text); }
    .sample-questions-list { list-style: none; padding: 0; margin: 0; font-size: 0.85rem; color: var(--subtle-text); }
    .sample-questions-list li { margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sample-questions-list li::before { content: '›'; margin-right: 0.5rem; font-weight: bold; }
    .hover-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .quick-start-btn, .learn-more-btn { flex: 1; padding: 0.6rem; border: none; border-radius: 9999px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .quick-start-btn { background-color: var(--primary-color); color: white; }
    .quick-start-btn:hover { background-color: #4f46e5; }
    .learn-more-btn { background-color: var(--border-color); color: var(--text-color); }
    .learn-more-btn:hover { background-color: #d1d5db; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; }
    .question-count { font-size: 0.875rem; font-weight: 500; color: var(--subtle-text); }
    .card-button { background-color: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: background-color 0.2s ease; }
    .category-card:hover .card-button { background-color: #4f46e5; }
    .card-button svg { transition: transform 0.2s ease; }
    .category-card:hover .card-button svg { transform: translateX(3px); }
    
    @keyframes pulse { 50% { opacity: 0.5; } }
    .skeleton-section-title { height: 2rem; width: 200px; background-color: var(--skeleton-color); border-radius: 0.5rem; margin-bottom: 1.5rem; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .skeleton { cursor: default; pointer-events: none; }
    .skeleton .skeleton-image, .skeleton .skeleton-title, .skeleton .skeleton-desc, .skeleton .skeleton-footer { background-color: var(--skeleton-color); border-radius: 0.5rem; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .skeleton-image { height: 160px; width: 100%; }
    .skeleton-content { padding: 1.25rem; }
    .skeleton-title { height: 1.5rem; width: 60%; margin-bottom: 0.75rem; }
    .skeleton-desc { height: 1rem; width: 90%; margin-bottom: 0.5rem; }
    .skeleton-desc.short { width: 70%; }
    .skeleton-footer { margin-top: 1.25rem; height: 2.25rem; width: 50%; margin-left: auto; }
  `}</style><CategoriesPage /></>);
}

