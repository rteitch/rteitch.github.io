const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const wordsContainer = document.getElementById('words');
const inputBox = document.getElementById('input-box');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const timeButtons = document.querySelectorAll('.time-btn');

let currentWords = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let testStarted = false;
let testEnded = false;
let timer;
let timeLimit = 60;
let timeLeft = timeLimit;
let correctChars = 0;
let incorrectChars = 0;
let totalChars = 0;
let startTime;

function generateWords(count = 200) {
    currentWords = [];
    for (let i = 0; i < count; i++) {
        currentWords.push(words[Math.floor(Math.random() * words.length)]);
    }
}

function renderWords() {
    wordsContainer.innerHTML = '';
    currentWords.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        if (wordIdx === 0) wordSpan.classList.add('active');
        
        word.split('').forEach((char, charIdx) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
        });
        
        // Add space after word
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'char space';
        spaceSpan.textContent = ' ';
        wordSpan.appendChild(spaceSpan);
        
        wordsContainer.appendChild(wordSpan);
    });
}

function initializeTest() {
    generateWords();
    renderWords();
    currentWordIndex = 0;
    currentCharIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    totalChars = 0;
    timeLeft = timeLimit;
    testStarted = false;
    testEnded = false;
    inputBox.value = '';
    inputBox.disabled = false;
    timerEl.innerText = timeLimit;
    wpmEl.innerText = 'WPM: 0';
    accuracyEl.innerText = 'Accuracy: 100%';
    clearInterval(timer);
    
    // Set cursor on first character
    const firstChar = wordsContainer.querySelector('.word.active .char');
    if (firstChar) {
        firstChar.classList.add('cursor');
    }
}

function startTest() {
    if (testStarted) return;
    testStarted = true;
    startTime = Date.now();
    
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        updateStats();
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    testEnded = true;
    clearInterval(timer);
    inputBox.disabled = true;
    updateStats();
}

function updateStats() {
    const timeElapsed = timeLimit - timeLeft;
    const minutes = timeElapsed / 60;
    
    // Calculate WPM (Words Per Minute)
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    
    // Calculate Accuracy
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    wpmEl.innerText = `WPM: ${wpm}`;
    accuracyEl.innerText = `Accuracy: ${accuracy}%`;
}

function moveToNextWord() {
    const words = wordsContainer.querySelectorAll('.word');
    if (currentWordIndex < words.length - 1) {
        words[currentWordIndex].classList.remove('active');
        currentWordIndex++;
        words[currentWordIndex].classList.add('active');
        currentCharIndex = 0;
        
        // Scroll to keep active word visible
        const activeWord = words[currentWordIndex];
        const container = wordsContainer;
        const wordTop = activeWord.offsetTop;
        const containerScroll = container.scrollTop;
        const containerHeight = container.clientHeight;
        
        if (wordTop < containerScroll || wordTop > containerScroll + containerHeight - 100) {
            container.scrollTop = wordTop - 50;
        }
    } else {
        // Generate more words if needed
        const scrollPosition = wordsContainer.scrollTop;
        generateWords();
        renderWords();
        currentWordIndex = 0;
        currentCharIndex = 0;
        wordsContainer.scrollTop = scrollPosition;
    }
}

inputBox.addEventListener('input', (e) => {
    if (testEnded) return;
    
    if (!testStarted) {
        startTest();
    }
    
    const typedValue = e.target.value;
    const words = wordsContainer.querySelectorAll('.word');
    const currentWord = words[currentWordIndex];
    const chars = currentWord.querySelectorAll('.char:not(.space)');
    const currentWordText = currentWords[currentWordIndex];
    
    // Remove all cursor classes
    currentWord.querySelectorAll('.char').forEach(c => c.classList.remove('cursor'));
    
    // Handle each character
    chars.forEach((char, idx) => {
        char.classList.remove('correct', 'incorrect', 'cursor');
        
        if (idx < typedValue.length) {
            if (typedValue[idx] === currentWordText[idx]) {
                char.classList.add('correct');
                if (idx === typedValue.length - 1) {
                    // This was just typed correctly
                    if (currentCharIndex <= idx) {
                        correctChars++;
                        totalChars++;
                        currentCharIndex = idx + 1;
                    }
                }
            } else {
                char.classList.add('incorrect');
                if (idx === typedValue.length - 1) {
                    // This was just typed incorrectly
                    if (currentCharIndex <= idx) {
                        incorrectChars++;
                        totalChars++;
                        currentCharIndex = idx + 1;
                    }
                }
            }
        }
    });
    
    // Add cursor to next character
    if (typedValue.length < chars.length) {
        chars[typedValue.length].classList.add('cursor');
    } else {
        // Cursor on space
        const space = currentWord.querySelector('.space');
        if (space) space.classList.add('cursor');
    }
    
    // Move to next word on space
    if (typedValue.endsWith(' ') && typedValue.trim().length > 0) {
        // Check if word is complete
        if (typedValue.trim().length >= currentWordText.length) {
            // Count the space
            totalChars++;
            if (typedValue.trim() === currentWordText) {
                correctChars++;
                currentWord.classList.add('word-correct');
            } else {
                currentWord.classList.add('word-incorrect');
            }
            
            inputBox.value = '';
            moveToNextWord();
            
            // Set cursor on first char of new word
            const newWord = wordsContainer.querySelectorAll('.word')[currentWordIndex];
            const firstChar = newWord.querySelector('.char');
            if (firstChar) firstChar.classList.add('cursor');
        }
    }
    
    updateStats();
});

// Handle backspace properly
inputBox.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && inputBox.value.length === 0 && currentWordIndex > 0) {
        e.preventDefault();
        // Go back to previous word
        const words = wordsContainer.querySelectorAll('.word');
        words[currentWordIndex].classList.remove('active');
        currentWordIndex--;
        words[currentWordIndex].classList.remove('word-correct', 'word-incorrect');
        words[currentWordIndex].classList.add('active');
        
        // Restore previous word value
        const prevWord = currentWords[currentWordIndex];
        inputBox.value = prevWord;
        currentCharIndex = prevWord.length;
    }
});

restartBtn.addEventListener('click', () => {
    initializeTest();
    inputBox.focus();
});

// Time selection buttons
timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        timeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timeLimit = parseInt(btn.dataset.time);
        initializeTest();
        inputBox.focus();
    });
});

// Initialize on load
initializeTest();
inputBox.focus();