import ConsentManager from "./ConsentManager";

const SESSIONS_KEY = "quiz:sessions:index";

function loadIndex() {
  try {
    const raw = ConsentManager.getItem(SESSIONS_KEY) || localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveIndex(idx) {
  try {
    const raw = JSON.stringify(idx);
    ConsentManager.setItem(SESSIONS_KEY, raw, ConsentManager.categories.essential);
  } catch {
    try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(idx)); } catch {}
  }
}

function sessionKey(id) {
  return `quiz:session:${id}`;
}

function generateId() {
  // Simple UUID v4-ish
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

const QuizSessionManager = {
  createSession(preferences) {
    const id = generateId();
    const meta = {
      id,
      preferences: preferences || {},
      createdAt: Date.now(),
      status: "active",
      currentQuestion: 1,
    };

    const idx = loadIndex();
    idx[id] = { id, createdAt: meta.createdAt, status: meta.status };
    saveIndex(idx);

    try {
      const raw = JSON.stringify(meta);
      ConsentManager.setItem(sessionKey(id), raw, ConsentManager.categories.essential);
    } catch {
      try { localStorage.setItem(sessionKey(id), JSON.stringify(meta)); } catch {}
    }

    return id;
  },

  getSession(id) {
    if (!id) return null;
    try {
      const raw = ConsentManager.getItem(sessionKey(id)) || localStorage.getItem(sessionKey(id));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  updateSession(id, patch) {
    const s = this.getSession(id);
    if (!s) return null;
    const next = { ...s, ...patch };
    try {
      const raw = JSON.stringify(next);
      ConsentManager.setItem(sessionKey(id), raw, ConsentManager.categories.essential);
    } catch {
      try { localStorage.setItem(sessionKey(id), JSON.stringify(next)); } catch {}
    }
    return next;
  },

  setCurrentQuestion(id, questionNumber) {
    return this.updateSession(id, { currentQuestion: Number(questionNumber) || 1 });
  },

  saveResults(id, results) {
    return this.updateSession(id, { status: "completed", results, completedAt: Date.now() });
  },

  hasValidSession(id) {
    const s = this.getSession(id);
    return Boolean(s && s.id);
  },
};

export default QuizSessionManager;
