// Suit mapping: button id -> suit code
const suitMap = {
  'suit-1m': 'm',
  'suit-1p': 'p',
  'suit-1s': 's',
  'suit-random': 'random'
};

// Initialize suit on page load
function initializeSuit() {
  let selectedSuit = localStorage.getItem('selectedSuit');
  if (!selectedSuit) {
    selectedSuit = 's'; // Default to bamboo (sou)
    localStorage.setItem('selectedSuit', selectedSuit);
  }
  // Deselect all buttons first, then highlight only the selected one
  for (const [btnId, suitCode] of Object.entries(suitMap)) {
    const btn = document.getElementById(btnId);
    btn.style.background = 'transparent';
    btn.style.color = 'var(--text)';
  }
  // Highlight the selected button
  for (const [btnId, suitCode] of Object.entries(suitMap)) {
    const btn = document.getElementById(btnId);
    if (suitCode === selectedSuit) {
      btn.style.background = 'var(--accent)';
      btn.style.color = 'var(--btn-text)';
    }
  }
}

// Settings modal functionality
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');

settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

closeSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Close modal when clicking outside of it
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

// Suit option buttons
const suitButtons = document.querySelectorAll('.suit-option-btn');
suitButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Deselect all buttons
    suitButtons.forEach(b => {
      b.style.background = 'transparent';
      b.style.color = 'var(--text)';
    });
    // Select clicked button
    e.target.style.background = 'var(--accent)';
    e.target.style.color = 'var(--btn-text)';
    
    // Save suit selection to localStorage
    const suitCode = suitMap[e.target.id];
    if (suitCode) {
      localStorage.setItem('selectedSuit', suitCode);
    }
  });
});

// Initialize on page load
initializeSuit();
