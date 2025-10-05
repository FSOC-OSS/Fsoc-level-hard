import { useState, useEffect, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'quiz_search_history';
const MAX_HISTORY_ITEMS = 20;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.warn('Failed to parse search history:', error);
        setSearchHistory([]);
      }
    }
  }, []);

  const saveToStorage = useCallback((history) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }, []);

  const addSearch = useCallback((query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return;
    }

    const trimmedQuery = query.trim();

    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());
      const newHistory = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      saveToStorage(newHistory);
      return newHistory;
    });
  }, [saveToStorage]);

  const removeSearch = useCallback((query) => {
    setSearchHistory(prev => {
      const newHistory = prev.filter(item => item !== query);
      saveToStorage(newHistory);
      return newHistory;
    });
  }, [saveToStorage]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  const getRecentSearches = useCallback((limit = 5) => {
    return searchHistory.slice(0, limit);
  }, [searchHistory]);

  return {
    searchHistory,
    addSearch,
    removeSearch,
    clearHistory,
    getRecentSearches
  };
};
