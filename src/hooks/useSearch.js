import { useState, useCallback, useRef, useEffect } from 'react';

const DEBOUNCE_DELAY = 300;

// Mock data for search functionality
const mockQuizzes = [
  { id: 1, title: 'General Knowledge Quiz', category: 'General Knowledge', difficulty: 'Easy', rating: 4.5, questionCount: 10, duration: 15, description: 'Test your general knowledge with this fun quiz', tags: ['general', 'easy', 'fun'] },
  { id: 2, title: 'Science and Nature', category: 'Science & Nature', difficulty: 'Medium', rating: 4.2, questionCount: 15, duration: 20, description: 'Explore the wonders of science and nature', tags: ['science', 'nature', 'educational'] },
  { id: 3, title: 'History Challenge', category: 'History', difficulty: 'Hard', rating: 4.7, questionCount: 20, duration: 30, description: 'Challenge yourself with historical facts and events', tags: ['history', 'challenging', 'educational'] },
  { id: 4, title: 'Movie Trivia', category: 'Entertainment: Film', difficulty: 'Medium', rating: 4.3, questionCount: 12, duration: 18, description: 'Test your knowledge of movies and cinema', tags: ['movies', 'entertainment', 'trivia'] },
  { id: 5, title: 'Sports Knowledge', category: 'Sports', difficulty: 'Easy', rating: 4.1, questionCount: 10, duration: 12, description: 'Sports facts and trivia for enthusiasts', tags: ['sports', 'trivia', 'fun'] }
];

const mockQuestions = [
  { id: 1, text: 'What is the capital of France?', category: 'Geography', difficulty: 'Easy' },
  { id: 2, text: 'Who painted the Mona Lisa?', category: 'Art', difficulty: 'Medium' },
  { id: 3, text: 'What is the speed of light?', category: 'Science: Physics', difficulty: 'Hard' },
  { id: 4, text: 'In which year did World War II end?', category: 'History', difficulty: 'Medium' },
  { id: 5, text: 'What is the largest planet in our solar system?', category: 'Science & Nature', difficulty: 'Easy' }
];

const mockCategories = [
  { id: 1, name: 'General Knowledge', questionCount: 50 },
  { id: 2, name: 'Science & Nature', questionCount: 35 },
  { id: 3, name: 'History', questionCount: 40 },
  { id: 4, name: 'Entertainment: Film', questionCount: 30 },
  { id: 5, name: 'Sports', questionCount: 25 }
];

const mockUsers = [
  { id: 1, name: 'John Doe', quizCount: 15 },
  { id: 2, name: 'Jane Smith', quizCount: 22 },
  { id: 3, name: 'Mike Johnson', quizCount: 8 }
];

const searchOperators = {
  'category:': (items, value) => items.filter(item =>
    item.category?.toLowerCase().includes(value.toLowerCase())
  ),
  'difficulty:': (items, value) => items.filter(item =>
    item.difficulty?.toLowerCase() === value.toLowerCase()
  ),
  'score:>': (items, value) => items.filter(item =>
    item.rating && item.rating > parseFloat(value)
  ),
  'score:<': (items, value) => items.filter(item =>
    item.rating && item.rating < parseFloat(value)
  ),
  '-': (items, value) => items.filter(item =>
    !item.title?.toLowerCase().includes(value.toLowerCase()) &&
    !item.name?.toLowerCase().includes(value.toLowerCase()) &&
    !item.text?.toLowerCase().includes(value.toLowerCase())
  )
};

const fuzzyMatch = (text, query, threshold = 0.6) => {
  if (!text || !query) return false;

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  if (textLower.includes(queryLower)) return true;

  const textWords = textLower.split(/\s+/);
  const queryWords = queryLower.split(/\s+/);

  return queryWords.some(queryWord =>
    textWords.some(textWord => {
      if (textWord.includes(queryWord) || queryWord.includes(textWord)) return true;

      const distance = levenshteinDistance(textWord, queryWord);
      const maxLength = Math.max(textWord.length, queryWord.length);
      return (maxLength - distance) / maxLength >= threshold;
    })
  );
};

const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
};

const parseSearchQuery = (query) => {
  const operators = [];
  let remainingQuery = query;

  for (const [operator, handler] of Object.entries(searchOperators)) {
    const regex = new RegExp(`${operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\s]+)`, 'gi');
    let match;

    while ((match = regex.exec(query)) !== null) {
      operators.push({ operator, value: match[1], handler });
      remainingQuery = remainingQuery.replace(match[0], '').trim();
    }
  }

  return { operators, remainingQuery: remainingQuery.trim() };
};

const searchInData = (data, query, fuzzy = true) => {
  if (!query) return data;

  const { operators, remainingQuery } = parseSearchQuery(query);

  let filteredData = [...data];

  operators.forEach(({ handler, value }) => {
    filteredData = handler(filteredData, value);
  });

  if (remainingQuery) {
    filteredData = filteredData.filter(item => {
      const searchableText = [
        item.title,
        item.name,
        item.text,
        item.description,
        item.category,
        ...(item.tags || [])
      ].filter(Boolean).join(' ');

      return fuzzy
        ? fuzzyMatch(searchableText, remainingQuery)
        : searchableText.toLowerCase().includes(remainingQuery.toLowerCase());
    });
  }

  return filteredData;
};

const applyFilters = (data, filters) => {
  let filtered = [...data];

  if (filters.categories?.length > 0) {
    filtered = filtered.filter(item =>
      filters.categories.includes(item.category)
    );
  }

  if (filters.difficulty?.length > 0) {
    filtered = filtered.filter(item =>
      filters.difficulty.includes(item.difficulty)
    );
  }

  if (filters.scoreRange?.min !== undefined || filters.scoreRange?.max !== undefined) {
    filtered = filtered.filter(item => {
      if (!item.rating) return false;
      const min = filters.scoreRange.min ?? 0;
      const max = filters.scoreRange.max ?? 5;
      return item.rating >= min && item.rating <= max;
    });
  }

  if (filters.durationRange?.min !== undefined || filters.durationRange?.max !== undefined) {
    filtered = filtered.filter(item => {
      if (!item.duration) return false;
      const min = filters.durationRange.min ?? 0;
      const max = filters.durationRange.max ?? 999;
      return item.duration >= min && item.duration <= max;
    });
  }

  if (filters.tags?.length > 0) {
    filtered = filtered.filter(item =>
      item.tags && filters.tags.some(tag => item.tags.includes(tag))
    );
  }

  return filtered;
};

const sortResults = (data, sortBy) => {
  const sorted = [...data];

  switch (sortBy) {
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    case 'score_desc':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'score_asc':
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    case 'difficulty_asc':
      return sorted.sort((a, b) => {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      });
    case 'difficulty_desc':
      return sorted.sort((a, b) => {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return (order[b.difficulty] || 0) - (order[a.difficulty] || 0);
      });
    case 'relevance':
    default:
      return sorted;
  }
};

const generateSuggestions = (query) => {
  if (!query || query.length < 2) return [];

  const allSuggestions = [
    ...mockQuizzes.map(q => q.title),
    ...mockCategories.map(c => c.name),
    ...mockQuizzes.flatMap(q => q.tags || []),
    'General Knowledge',
    'Science',
    'History',
    'Entertainment',
    'Sports',
    'Easy quiz',
    'Medium difficulty',
    'Hard challenge',
    'category:science',
    'difficulty:easy',
    'score:>4'
  ];

  return allSuggestions
    .filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase()) ||
      fuzzyMatch(suggestion, query, 0.7)
    )
    .slice(0, 8);
};

export const useSearch = () => {
  const [results, setResults] = useState({
    quizzes: [],
    questions: [],
    categories: [],
    users: []
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState({
    all: 0,
    quizzes: 0,
    questions: 0,
    categories: 0,
    users: 0
  });

  const debounceTimer = useRef(null);

  const performSearch = useCallback(async (query, filters = {}, sortBy = 'relevance', offset = 0, limit = 50) => {
    if (!query || query.trim().length === 0) {
      setResults({ quizzes: [], questions: [], categories: [], users: [] });
      setTotalResults({ all: 0, quizzes: 0, questions: 0, categories: 0, users: 0 });
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      let quizzes = searchInData(mockQuizzes, query);
      let questions = searchInData(mockQuestions, query);
      let categories = searchInData(mockCategories, query);
      let users = searchInData(mockUsers, query);

      quizzes = applyFilters(quizzes, filters);
      questions = applyFilters(questions, filters);
      categories = applyFilters(categories, filters);
      users = applyFilters(users, filters);

      quizzes = sortResults(quizzes, sortBy);
      questions = sortResults(questions, sortBy);
      categories = sortResults(categories, sortBy);
      users = sortResults(users, sortBy);

      const paginatedQuizzes = quizzes.slice(offset, offset + limit);
      const paginatedQuestions = questions.slice(offset, offset + limit);
      const paginatedCategories = categories.slice(offset, offset + limit);
      const paginatedUsers = users.slice(offset, offset + limit);

      setResults({
        quizzes: paginatedQuizzes,
        questions: paginatedQuestions,
        categories: paginatedCategories,
        users: paginatedUsers
      });

      const total = quizzes.length + questions.length + categories.length + users.length;
      setTotalResults({
        all: total,
        quizzes: quizzes.length,
        questions: questions.length,
        categories: categories.length,
        users: users.length
      });

    } catch (error) {
      console.error('Search error:', error);
      setResults({ quizzes: [], questions: [], categories: [], users: [] });
      setTotalResults({ all: 0, quizzes: 0, questions: 0, categories: 0, users: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback((query, filters, sortBy, offset, limit) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(query, filters, sortBy, offset, limit);
    }, DEBOUNCE_DELAY);

    const newSuggestions = generateSuggestions(query);
    setSuggestions(newSuggestions);
  }, [performSearch]);

  const clearResults = useCallback(() => {
    setResults({ quizzes: [], questions: [], categories: [], users: [] });
    setSuggestions([]);
    setTotalResults({ all: 0, quizzes: 0, questions: 0, categories: 0, users: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    results,
    suggestions,
    loading,
    totalResults,
    search,
    clearResults
  };
};
