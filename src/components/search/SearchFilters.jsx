import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, Calendar, Clock, Star, Tag } from 'lucide-react';

const SearchFilters = ({ filters, onFiltersChange, onClear, isOpen, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    difficulty: true,
    dateRange: false,
    score: false,
    duration: false,
    status: false,
    tags: false
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMultiSelectChange = (key, value) => {
    const current = localFilters[key] || [];
    const newValue = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    handleFilterChange(key, newValue);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.categories?.length > 0) count++;
    if (localFilters.difficulty?.length > 0) count++;
    if (localFilters.dateRange?.from || localFilters.dateRange?.to) count++;
    if (localFilters.scoreRange?.min !== undefined || localFilters.scoreRange?.max !== undefined) count++;
    if (localFilters.durationRange?.min !== undefined || localFilters.durationRange?.max !== undefined) count++;
    if (localFilters.status?.length > 0) count++;
    if (localFilters.tags?.length > 0) count++;
    return count;
  };

  const categories = [
    'General Knowledge',
    'Entertainment: Books',
    'Entertainment: Film',
    'Entertainment: Music',
    'Entertainment: Musicals & Theatres',
    'Entertainment: Television',
    'Entertainment: Video Games',
    'Entertainment: Board Games',
    'Science & Nature',
    'Science: Computers',
    'Science: Mathematics',
    'Mythology',
    'Sports',
    'Geography',
    'History',
    'Politics',
    'Art',
    'Celebrities',
    'Animals',
    'Vehicles'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const statuses = ['Not Started', 'In Progress', 'Completed'];
  const popularTags = [
    'favorites',
    'challenging',
    'quick',
    'educational',
    'fun',
    'trivia',
    'science',
    'history',
    'entertainment',
    'sports'
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
            {getActiveFilterCount()}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Clear all
            </button>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div>
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">Category</span>
              {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.category && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.categories?.includes(category) || false}
                      onChange={() => handleMultiSelectChange('categories', category)}
                      className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('difficulty')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">Difficulty</span>
              {expandedSections.difficulty ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.difficulty && (
              <div className="mt-2 space-y-2">
                {difficulties.map(difficulty => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.difficulty?.includes(difficulty) || false}
                      onChange={() => handleMultiSelectChange('difficulty', difficulty)}
                      className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{difficulty}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('dateRange')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </span>
              {expandedSections.dateRange ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.dateRange && (
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                  <input
                    type="date"
                    value={localFilters.dateRange?.from || ''}
                    onChange={(e) => handleFilterChange('dateRange', { ...localFilters.dateRange, from: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                  <input
                    type="date"
                    value={localFilters.dateRange?.to || ''}
                    onChange={(e) => handleFilterChange('dateRange', { ...localFilters.dateRange, to: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('score')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Score Range
              </span>
              {expandedSections.score ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.score && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Min %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.scoreRange?.min || ''}
                      onChange={(e) => handleFilterChange('scoreRange', { ...localFilters.scoreRange, min: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.scoreRange?.max || ''}
                      onChange={(e) => handleFilterChange('scoreRange', { ...localFilters.scoreRange, max: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('duration')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (minutes)
              </span>
              {expandedSections.duration ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.duration && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Min</label>
                    <input
                      type="number"
                      min="0"
                      value={localFilters.durationRange?.min || ''}
                      onChange={(e) => handleFilterChange('durationRange', { ...localFilters.durationRange, min: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max</label>
                    <input
                      type="number"
                      min="0"
                      value={localFilters.durationRange?.max || ''}
                      onChange={(e) => handleFilterChange('durationRange', { ...localFilters.durationRange, max: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('status')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">Status</span>
              {expandedSections.status ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.status && (
              <div className="mt-2 space-y-2">
                {statuses.map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.status?.includes(status) || false}
                      onChange={() => handleMultiSelectChange('status', status)}
                      className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('tags')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </span>
              {expandedSections.tags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSections.tags && (
              <div className="mt-2 space-y-2">
                {popularTags.map(tag => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.tags?.includes(tag) || false}
                      onChange={() => handleMultiSelectChange('tags', tag)}
                      className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">#{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
