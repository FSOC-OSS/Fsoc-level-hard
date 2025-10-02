// Constants and LocalStorage helpers
const MAX_HINTS = 3;

function getRemainingHints() {
  const stored = localStorage.getItem('quiz_hints');
  return stored !== null ? parseInt(stored, 10) : MAX_HINTS;
}

function setRemainingHints(count) {
  localStorage.setItem('quiz_hints', count);
}

// UI updates
function updateHintCounter() {
  const counterEl = document.querySelector('#hint-counter');
  const hints = getRemainingHints();
  counterEl.textContent = hints;
  counterEl.classList.toggle('text-gray-400', hints === 0);
}

function disableHintButton() {
  const btn = document.querySelector('#hint-button');
  btn.disabled = true;
  btn.classList.add('opacity-50', 'cursor-not-allowed');
}

// Hint application
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function applyHint() {
  let hints = getRemainingHints();
  if (hints <= 0) return;
  if (document.querySelector('.option.selected')) return;

  const options = Array.from(document.querySelectorAll('.option'));
  const incorrect = options.filter(o => o.dataset.correct !== 'true');
  if (incorrect.length <= 2) {
    hints = 0;
    setRemainingHints(hints);
    updateHintCounter();
    disableHintButton();
    return;
  }

  shuffleArray(incorrect)
    .slice(0, 2)
    .forEach(el => {
      el.classList.add('animation-fade-out', 'pointer-events-none');
      setTimeout(() => el.style.display = 'none', 500);
    });

  hints -= 1;
  setRemainingHints(hints);
  updateHintCounter();
  if (hints === 0) disableHintButton();
}

// Initialization
function resetHints() {
  setRemainingHints(MAX_HINTS);
  updateHintCounter();
}

document.addEventListener('DOMContentLoaded', () => {
  resetHints();
  document.querySelector('#hint-button')
          .addEventListener('click', applyHint);
});
