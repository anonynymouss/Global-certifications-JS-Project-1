const passwordInput = document.getElementById('passwordInput');
const meterBar = document.getElementById('meterBar');
const scoreValue = document.getElementById('scoreValue');
const crackTime = document.getElementById('crackTime');
const strengthEmoji = document.getElementById('strengthEmoji');
const suggestionsBox = document.getElementById('suggestionsBox');
const securityAlert = document.getElementById('securityAlert');

const emojiStates = {
  weak: ['😰', '🚫', '💀', '👎', '❌'],
  medium: ['🛡️', '⚠️', '🔐', '👀', '✋'],
  strong: ['🔒', '✅', '👍', '💪', '🎉']
};

let debounceTimer;
passwordInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(analyzePassword, 150);
});

function analyzePassword() {
  const pwd = passwordInput.value;
  const score = getScore(pwd);
  const percent = (score / 4) * 100;

  meterBar.style.width = `${percent}%`;
  meterBar.style.background = score < 2 ? 'var(--danger)' : score < 3 ? '#f59e0b' : 'var(--success)';
  scoreValue.textContent = `${percent}%`;
  crackTime.textContent = getCrackTime(pwd.length, score);
  suggestionsBox.innerHTML = getSuggestions(pwd).map(s => `<p>• ${s}</p>`).join('');
  securityAlert.style.display = pwd.toLowerCase().includes('123') ? 'flex' : 'none';

  const emojiSet = score <= 1 ? emojiStates.weak : score === 2 ? emojiStates.medium : emojiStates.strong;
  const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
  strengthEmoji.textContent = randomEmoji;

  updateCardStrength(score);
  updateEmojiBackground(emojiSet);
}

function getScore(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function getCrackTime(length, score) {
  if (score <= 1) return 'Instant';
  if (score === 2) return 'Minutes';
  if (score === 3) return 'Days';
  return 'Centuries';
}

function getSuggestions(password) {
  const suggestions = [];
  if (password.length < 8) suggestions.push('Use at least 8 characters.');
  if (!/[A-Z]/.test(password)) suggestions.push('Add uppercase letters.');
  if (!/[0-9]/.test(password)) suggestions.push('Include some numbers.');
  if (!/[^A-Za-z0-9]/.test(password)) suggestions.push('Try adding symbols.');
  return suggestions;
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  const password = Array.from({ length: 16 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  passwordInput.value = password;
  analyzePassword();
}

function updateCardStrength(score) {
  const card = document.querySelector('.security-card');
  for (let i = 0; i <= 4; i++) {
    card.classList.remove(`strength-${i}`);
  }
  card.classList.add(`strength-${score}`);
}

function updateEmojiBackground(emojiSet) {
  const bg = document.querySelector('.emoji-bg');
  bg.innerHTML = '';

  for (let i = 0; i < 30; i++) {
    const span = document.createElement('span');
    span.className = 'floating-emoji';
    span.textContent = emojiSet[Math.floor(Math.random() * emojiSet.length)];
    span.style.left = `${Math.random() * 100}%`;
    span.style.top = `${Math.random() * 100}%`;
    span.style.fontSize = `${Math.random() * 2 + 1.5}rem`;
    bg.appendChild(span);
  }
}
