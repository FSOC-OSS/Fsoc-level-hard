import React, { useState, useEffect } from 'react';
import { Search, Star, Edit2, Trash2, Plus, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SAVED_SEARCHES_KEY = 'quiz_saved_searches';
const MAX_SAVED_SEARCHES = 5;

const SavedSearches = ({ currentQuery, currentFilters, onSave, className = '' }) => {
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingSearch, setEditingSearch] = useState(null);
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = () => {
    try {
      const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedSearches(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn('Failed to load saved searches:', error);
      setSavedSearches([]);
    }
  };

  const saveToStorage = (searches) => {
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.warn('Failed to save searches:', error);
    }
  };

  const handleSaveSearch = () => {
    if (!searchName.trim() || !currentQuery?.trim()) return;

    const newSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      query: currentQuery.trim(),
      filters: { ...currentFilters },
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    if (editingSearch) {
      const updatedSearches = savedSearches.map(search =>
        search.id === editingSearch.id
          ? { ...newSearch, id: editingSearch.id, createdAt: editingSearch.createdAt }
          : search
      );
      setSavedSearches(updatedSearches);
      saveToStorage(updatedSearches);
    } else {
      const newSearches = [newSearch, ...savedSearches].slice(0, MAX_SAVED_SEARCHES);
      setSavedSearches(newSearches);
      saveToStorage(newSearches);
    }

    setShowSaveModal(false);
    setEditingSearch(null);
    setSearchName('');
    onSave?.();
  };

  const handleDeleteSearch = (searchId) => {
    const updatedSearches = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(updatedSearches);
    saveToStorage(updatedSearches);
  };

  const handleUseSearch = (search) => {
    const updatedSearch = {
      ...search,
      lastUsed: new Date().toISOString()
    };

    const updatedSearches = savedSearches.map(s =>
      s.id === search.id ? updatedSearch : s
    );
    setSavedSearches(updatedSearches);
    saveToStorage(updatedSearches);

    const params = new URLSearchParams({ q: search.query });
    if (search.filters) {
      Object.entries(search.filters).forEach(([key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
          params.set(`filter_${key}`, JSON.stringify(value));
        }
      });
    }

    navigate(`/search?${params.toString()}`);
  };

  const openSaveModal = () => {
    setSearchName('');
    setEditingSearch(null);
    setShowSaveModal(true);
  };

  const openEditModal = (search) => {
    setSearchName(search.name);
    setEditingSearch(search);
    setShowSaveModal(true);
  };

  const getFilterSummary = (filters) => {
    const summaryParts = [];

    if (filters.categories?.length > 0) {
      summaryParts.push(`${filters.categories.length} categories`);
    }
    if (filters.difficulty?.length > 0) {
      summaryParts.push(`${filters.difficulty.length} difficulties`);
    }
    if (filters.scoreRange?.min !== undefined || filters.scoreRange?.max !== undefined) {
      summaryParts.push('score range');
    }
    if (filters.tags?.length > 0) {
      summaryParts.push(`${filters.tags.length} tags`);
    }

    return summaryParts.length > 0 ? summaryParts.join(', ') : 'No filters';
  };

  if (savedSearches.length === 0 && !currentQuery) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Saved Searches
        </h3>
        <div className="flex space-x-2">
          {currentQuery && (
            <button
              onClick={openSaveModal}
              disabled={savedSearches.length >= MAX_SAVED_SEARCHES}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Save Search</span>
            </button>
          )}
          {savedSearches.length > 0 && (
            <button
              onClick={() => setShowManageModal(true)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Manage</span>
            </button>
          )}
        </div>
      </div>

      {savedSearches.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {savedSearches.map((search) => (
            <div
              key={search.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUseSearch(search)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate flex-1">
                  {search.name}
                </h4>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(search);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSearch(search.id);
                    }}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                "{search.query}"
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                {getFilterSummary(search.filters)}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(search.lastUsed).toLocaleDateString()}
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                  Saved
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {savedSearches.length >= MAX_SAVED_SEARCHES && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You've reached the maximum of {MAX_SAVED_SEARCHES} saved searches.
            Delete some to save new ones.
          </p>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingSearch ? 'Edit Search' : 'Save Search'}
              </h3>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setEditingSearch(null);
                  setSearchName('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Name
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter a name for this search..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Query
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  "{currentQuery}"
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filters
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  {getFilterSummary(currentFilters)}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveSearch}
                  disabled={!searchName.trim()}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingSearch ? 'Update' : 'Save'} Search
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setEditingSearch(null);
                    setSearchName('');
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Manage Saved Searches
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {search.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      "{search.query}"
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {getFilterSummary(search.filters)} • Last used: {new Date(search.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setShowManageModal(false);
                        handleUseSearch(search);
                      }}
                      className="text-purple-600 hover:text-purple-700 p-2"
                      title="Use search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setShowManageModal(false);
                        openEditModal(search);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                      title="Edit search"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSearch(search.id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2"
                      title="Delete search"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {savedSearches.length === 0 && (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No saved searches yet</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowManageModal(false)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedSearches;
