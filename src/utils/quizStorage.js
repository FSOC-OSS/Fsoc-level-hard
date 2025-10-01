// Quiz state storage utility for secure localStorage management

const QUIZ_STORAGE_KEY = 'quiz_session_data';
const QUIZ_EXPIRY_KEY = 'quiz_session_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Encrypts sensitive quiz data using simple encoding
 * Note: This is basic obfuscation, not cryptographic security
 */
const encodeQuizData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  } catch (error) {
    console.error('Error encoding quiz data:', error);
    return null;
  }
};

/**
 * Decrypts quiz data
 */
const decodeQuizData = (encodedData) => {
  try {
    const jsonString = atob(encodedData);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding quiz data:', error);
    return null;
  }
};

/**
 * Checks if stored session has expired
 */
const isSessionExpired = () => {
  const expiry = localStorage.getItem(QUIZ_EXPIRY_KEY);
  if (!expiry) return true;

  return Date.now() > parseInt(expiry);
};

/**
 * Saves quiz state to localStorage with expiry
 */
export const saveQuizState = (quizState) => {
  try {
    const dataToSave = {
      ...quizState,
      timestamp: Date.now(),
      version: '1.0'
    };

    const encodedData = encodeQuizData(dataToSave);
    if (!encodedData) return false;

    const expiry = Date.now() + SESSION_DURATION;

    localStorage.setItem(QUIZ_STORAGE_KEY, encodedData);
    localStorage.setItem(QUIZ_EXPIRY_KEY, expiry.toString());

    return true;
  } catch (error) {
    console.error('Error saving quiz state:', error);
    return false;
  }
};

/**
 * Loads quiz state from localStorage
 */
export const loadQuizState = () => {
  try {
    if (isSessionExpired()) {
      clearQuizState();
      return null;
    }

    const encodedData = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!encodedData) return null;

    const quizState = decodeQuizData(encodedData);

    // Validate the loaded data structure
    if (!quizState || typeof quizState !== 'object') {
      clearQuizState();
      return null;
    }

    // Check version compatibility
    if (quizState.version !== '1.0') {
      clearQuizState();
      return null;
    }

    return quizState;
  } catch (error) {
    console.error('Error loading quiz state:', error);
    clearQuizState();
    return null;
  }
};

/**
 * Clears all quiz data from localStorage
 */
export const clearQuizState = () => {
  try {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    localStorage.removeItem(QUIZ_EXPIRY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing quiz state:', error);
    return false;
  }
};

/**
 * Checks if there's a saved quiz session
 */
export const hasSavedSession = () => {
  if (isSessionExpired()) {
    clearQuizState();
    return false;
  }

  return localStorage.getItem(QUIZ_STORAGE_KEY) !== null;
};

/**
 * Updates only specific fields in the saved quiz state
 */
export const updateQuizState = (updates) => {
  try {
    const currentState = loadQuizState();
    if (!currentState) return false;

    const updatedState = {
      ...currentState,
      ...updates,
      timestamp: Date.now()
    };

    return saveQuizState(updatedState);
  } catch (error) {
    console.error('Error updating quiz state:', error);
    return false;
  }
};

/**
 * Creates a quiz state snapshot for saving
 */
export const createQuizSnapshot = ({
  questions,
  currentQuestionIndex,
  selectedAnswers,
  score,
  timeRemaining,
  isPaused,
  quizStartTime
}) => {
  return {
    questions: questions.map(q => ({
      ...q,
      // Don't save correct answers to prevent cheating
      correct_answer: undefined
    })),
    currentQuestionIndex,
    selectedAnswers,
    score,
    timeRemaining,
    isPaused,
    quizStartTime,
    pauseCount: 0
  };
};

/**
 * Restores quiz state from snapshot, fetching missing data
 */
export const restoreQuizFromSnapshot = (snapshot, originalQuestions) => {
  if (!snapshot || !originalQuestions) return null;

  // Restore correct answers from original questions
  const restoredQuestions = snapshot.questions.map((savedQ, index) => {
    const originalQ = originalQuestions[index];
    return originalQ ? {
      ...savedQ,
      correct_answer: originalQ.correct_answer
    } : savedQ;
  });

  return {
    ...snapshot,
    questions: restoredQuestions
  };
};
