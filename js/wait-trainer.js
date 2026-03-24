// Wait Trainer JavaScript
console.log('Wait Trainer script loaded');
// const TILES = {
//   // z tiles (honors - East, South, West, North, White, Green, Red)
//   '1z': '1', '2z': '2', '3z': '3', '4z': '4', '5z': '5', '6z': '6', '7z': '7',
  
//   // m tiles (characters/man)
//   '1m': 'q', '2m': 'w', '3m': 'e', '4m': 'r', '5m': 't',
//   '6m': 'y', '7m': 'u', '8m': 'i', '9m': 'o',
  
//   // p tiles (dots/pin)
//   '1p': 'a', '2p': 's', '3p': 'd', '4p': 'f', '5p': 'g',
//   '6p': 'h', '7p': 'j', '8p': 'k', '9p': 'l',
  
//   // s tiles (bamboo/sou)
//   '1s': 'z', '2s': 'x', '3s': 'c', '4s': 'v', '5s': 'b',
//   '6s': 'n', '7s': 'm', '8s': ',', '9s': '.'
// };

let shuffledCombos = [];
let currentIndex = 0;
let isFinished = false;
let isReviewing = false;
let currentWaitNumbers = [];
let selectedNumbers = new Set();
let score = 0;
let seed = 0;
let sessionPatterns = []; // Track all patterns shown in this session
let sessionStart = 0;
let timerInterval = null;
let sessionElapsedTime = 0;
let feedbackTimeout = null;
let selectedSuit = 's'; // Default to bamboo (sou)

// Load selected suit from localStorage
function loadSelectedSuit() {
  selectedSuit = localStorage.getItem('selectedSuit') || 's';
}

// Transform pattern with suit suffix
function transformPatternWithSuit(pattern) {
  let currentSuit = selectedSuit;
  if (currentSuit === 'random') {
    currentSuit = ['m', 'p', 's'][Math.floor(Math.random() * 3)]; // Randomly pick a suit for display 
  }
  // Map each digit to its tile notation, then to its keyboard character
  return pattern.split('').map(digit => {
    const tileNotation = digit + currentSuit;
    return TILES[tileNotation] || digit; // Fallback to digit if not found
  }).join('');
}

function generateSeed() {
  return Math.floor(Math.random() * 10000000); // 7 digits: 0-9999999
}

function startTimer() {
  sessionStart = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    sessionElapsedTime = (Date.now() - sessionStart) / 1000;
    document.getElementById('timer-bar-display').textContent = sessionElapsedTime.toFixed(1) + 's';
  }, 100); // Update every 100ms for smooth display
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

function initializeActivity() {
  loadSelectedSuit();
  shuffledCombos = shuffleArray(COMBINATIONS, seed);
  currentIndex = 0;
  isFinished = false;
  isReviewing = false;
  score = 0;
  sessionPatterns = [];
  document.getElementById('combinations-container').style.display = 'flex';
  document.getElementById('activity-buttons').style.display = 'flex';
  document.getElementById('finish-buttons').style.display = 'none';
  document.getElementById('review-view').style.display = 'none';
  document.getElementById('stats-bar').style.display = 'flex';
  document.getElementById('feedback-bar-emoji').textContent = '';
  document.getElementById('feedback-section').style.display = 'none';
  displayCurrentCombination();
  showActivityButtons();
  startTimer();
}

function displayCurrentCombination() {
  selectedNumbers.clear();
  clearSelections();
  
  const combo = shuffledCombos[currentIndex];
  const randomized = getRandomizedComboWithWait(combo, seed + currentIndex);
  currentWaitNumbers = randomized.waitNumbers;
  
  const displayPattern = transformPatternWithSuit(randomized.pattern);
  document.getElementById('combination-display').textContent = displayPattern;
  document.getElementById('question-counter').textContent = `${currentIndex + 1}/${shuffledCombos.length}`;
}

function clearSelections() {
  document.querySelectorAll('.select-btn').forEach(btn => {
    const num = parseInt(btn.getAttribute('data-num'), 10);
    btn.style.backgroundColor = 'transparent';
    btn.style.color = 'var(--text)';
  });
}

function toggleSelection(num) {
  if (selectedNumbers.has(num)) {
    selectedNumbers.delete(num);
  } else {
    selectedNumbers.add(num);
  }
  updateButtonStyles();
}

function updateButtonStyles() {
  document.querySelectorAll('.select-btn').forEach(btn => {
    const num = parseInt(btn.getAttribute('data-num'), 10);
    if (selectedNumbers.has(num)) {
      btn.style.backgroundColor = 'var(--accent)';
      btn.style.color = 'var(--btn-text)';
    } else {
      btn.style.backgroundColor = 'transparent';
      btn.style.color = 'var(--text)';
    }
  });
}

function checkAnswer() {
  // Check if all wait numbers are selected and no extra numbers are selected
  const waitSet = new Set(currentWaitNumbers);
  const correctAnswer = selectedNumbers.size === waitSet.size && 
                        [...selectedNumbers].every(num => waitSet.has(num));
  
  // Clear any previous feedback timeout
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
  
  document.getElementById('feedback-bar-emoji').textContent = correctAnswer ? '✅' : '❌';
  
  // Track this pattern (store original pattern, not transformed)
  const combo = shuffledCombos[currentIndex];
  const randomized = getRandomizedComboWithWait(combo, seed + currentIndex);
  sessionPatterns.push({
    index: combo.index,
    pattern: randomized.pattern,
    correct: correctAnswer
  });
  
  if (correctAnswer) {
    score++;
  }
  
  return correctAnswer;
}

function showPassFeedback() {
  // Pass always shows red X
  // Clear any previous feedback timeout
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
  
  document.getElementById('feedback-bar-emoji').textContent = '❌';
  
  // Track this pattern (store original pattern, not transformed)
  const combo = shuffledCombos[currentIndex];
  const randomized = getRandomizedComboWithWait(combo, seed + currentIndex);
  sessionPatterns.push({
    index: combo.index,
    pattern: randomized.pattern,
    correct: false
  });
}

function clearFeedbackAfterDelay() {
  feedbackTimeout = setTimeout(() => {
    document.getElementById('feedback-bar-emoji').textContent = '';
  }, 2000);
}

function nextCombination() {
  currentIndex++;
  if (currentIndex >= shuffledCombos.length) {
    // Show finish state with score and time
    stopTimer();
    isFinished = true;
    document.getElementById('combinations-container').style.display = 'none';
    document.getElementById('activity-buttons').style.display = 'none';
    document.getElementById('stats-bar').style.display = 'none';
    document.getElementById('finish-text').style.display = 'block';
    document.getElementById('finish-text').textContent = `Score: ${score}/${shuffledCombos.length} | Time: ${sessionElapsedTime.toFixed(3)}s`;
    document.getElementById('finish-buttons').style.display = 'flex';
    showActivityButtons(false);
  } else {
    displayCurrentCombination();
  }
}

function showActivityButtons(isNormal = true) {
  const passBtn = document.getElementById('pass-btn');
  const nextBtn = document.getElementById('next-btn');
  if (isNormal) {
    passBtn.textContent = 'End';
    passBtn.style.backgroundColor = '#d1495a';
    nextBtn.textContent = 'Next';
    nextBtn.style.backgroundColor = '#4caf50';
  }
}

function displayReview() {
  isReviewing = true;
  document.getElementById('finish-text').style.display = 'none';
  document.getElementById('finish-buttons').style.display = 'none';
  document.getElementById('stats-bar').style.display = 'none';
  document.getElementById('review-view').style.display = 'flex';
  document.getElementById('review-seed').textContent = seed;
  
  // Populate review patterns with wait numbers
  const reviewContainer = document.getElementById('review-patterns');
  reviewContainer.innerHTML = '';
  sessionPatterns.forEach((sessionPattern, idx) => {
    const displayPattern = transformPatternWithSuit(sessionPattern.pattern);
    const combo = COMBINATIONS.find(c => c.index === sessionPattern.index);
    const randomized = getRandomizedComboWithWait(combo, seed + idx);
    const waitNums = randomized.waitNumbers.join(', ');
    
    const patternDiv = document.createElement('div');
    patternDiv.style.cssText = 'border: 1px solid var(--accent); padding: 1rem; border-radius: 4px; text-align: center;';
    patternDiv.innerHTML = `
      <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--muted);">Pattern ${sessionPattern.index}</p>
      <p style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-family: 'MahjongFont';">${displayPattern}</p>
      <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
        <span style="font-size: 1.2rem;">${sessionPattern.correct ? '✅' : '❌'}</span>
        <span style="font-size: 0.85rem; color: var(--muted);">Wait: ${waitNums}</span>
      </div>
    `;
    reviewContainer.appendChild(patternDiv);
  });
}

// Initialize immediately since scripts are loaded at end of body
seed = generateSeed();
document.getElementById('seed-display').textContent = seed;
initializeActivity();

// Add event listeners to select buttons
document.querySelectorAll('.select-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const num = parseInt(btn.getAttribute('data-num'), 10);
    toggleSelection(num);
  });
});

// Keyboard listeners for 1-9 and Enter
document.addEventListener('keydown', (e) => {
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 9 && !isFinished && !isReviewing) {
    toggleSelection(num);
  }
  if (e.key === 'Enter' && !isFinished && !isReviewing) {
    document.getElementById('next-btn').click();
  }
});

document.getElementById('pass-btn').addEventListener('click', () => {
  if (!isFinished) {
    // Skip to the end screen with results
    stopTimer();
    isFinished = true;
    document.getElementById('combinations-container').style.display = 'none';
    document.getElementById('activity-buttons').style.display = 'none';
    document.getElementById('stats-bar').style.display = 'none';
    document.getElementById('finish-text').style.display = 'block';
    document.getElementById('finish-text').textContent = `Score: ${score}/${shuffledCombos.length} | Time: ${sessionElapsedTime.toFixed(3)}s`;
    document.getElementById('finish-buttons').style.display = 'flex';
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (!isFinished) {
    checkAnswer();
    nextCombination();
    clearFeedbackAfterDelay();
  }
});

document.getElementById('review-btn').addEventListener('click', () => {
  displayReview();
});

document.getElementById('try-again-btn').addEventListener('click', () => {
  document.getElementById('finish-text').style.display = 'none';
  document.getElementById('finish-buttons').style.display = 'none';
  document.getElementById('review-view').style.display = 'none';
  document.getElementById('combinations-container').style.display = 'flex';
  initializeActivity();
});

document.getElementById('back-home-btn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

document.getElementById('back-review-btn').addEventListener('click', () => {
  isReviewing = false;
  document.getElementById('review-view').style.display = 'none';
  document.getElementById('stats-bar').style.display = 'none';
  document.getElementById('finish-text').style.display = 'block';
  document.getElementById('finish-buttons').style.display = 'flex';
});
