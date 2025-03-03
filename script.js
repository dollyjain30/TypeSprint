const typingText = document.querySelector('.typing-text p');
const input = document.querySelector('.wrapper .input-field');
const time = document.querySelector('.time span b');
const mistakes = document.querySelector('.mistake span');
const wpm = document.querySelector('.wpm span');
const cpm = document.querySelector('.cpm span');
const accuracy = document.querySelector('.accuracy span');
const btn = document.querySelector('button');
const themeToggle = document.getElementById('theme-toggle');
const difficultySelect = document.getElementById('difficulty');
const progressBar = document.querySelector('.progress-bar .progress');
const achievementPopup = document.querySelector('.achievement-popup');
const popupMessage = document.querySelector('.achievement-popup .message');
const closePopupButton = document.querySelector('.achievement-popup .close-popup');

let timer;
let maxTime = 60; // Default value, will be updated based on difficulty
let timeLeft = maxTime;
let charIndex = 0;
let mistake = 0;
let isTyping = false;
let textCompleted = false;

const paragraphs = {
    easy: [
        "Nature's beauty can be found in every small detail.",
        "Learning new things keeps the mind sharp.",
        "A good book can transport you to another world.",
    ],
    medium: [
        "Taking a walk in the park is a great way to relax and clear your mind.",
        "Small acts of kindness can make a big difference in someone's day.",
        "Healthy eating habits lead to a stronger body and a more focused mind.",
    ],
    hard: [
        "A smile is the universal language of kindness and understanding.",
        "Music has the power to lift spirits and bring people together.",
        "Staying hydrated is key to maintaining energy and focus throughout the day.",
        "Every sunrise brings new opportunities to make the most of the day."
    ]
};

const difficultyTimes = {
    easy: 60,
    medium: 45,
    hard: 30
};

function loadParagraph() {
    const difficulty = difficultySelect.value;
    const selectedParagraphs = paragraphs[difficulty];
    const randomIndex = Math.floor(Math.random() * selectedParagraphs.length);
    const paragraph = selectedParagraphs[randomIndex];

    typingText.innerHTML = '';
    for (const char of paragraph) {
        typingText.innerHTML += `<span>${char}</span>`;
    }
    typingText.querySelectorAll('span')[0].classList.add('active');
    document.addEventListener('keydown', () => input.focus());
    typingText.addEventListener('click', () => {
        input.focus();
    });
    textCompleted = false;
}

function initTyping() {
    const chars = typingText.querySelectorAll('span');
    const typedChar = input.value.charAt(charIndex);

    if (charIndex < chars.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTime, 1000);
            isTyping = true;
        }
        if (chars[charIndex].innerText === typedChar) {
            chars[charIndex].classList.add('correct');
        } else {
            mistake++;
            chars[charIndex].classList.add('incorrect');
        }

        charIndex++;
        if (charIndex < chars.length) {
            chars[charIndex].classList.add('active');
        } else {
            textCompleted = true;
            // Stop the timer
            clearInterval(timer);
            // Optional: you can display an achievement or message here
            if (isAccuracyPerfect()) {
                showAchievementPopup();
            }
        }

        mistakes.innerText = mistake;
        cpm.innerText = charIndex - mistake;
        updateAccuracy();
        updateProgress();
    }
}

function initTime() {
    if (timeLeft > 0) {
        timeLeft--;
        time.innerText = timeLeft;
        const wpmVal = Math.round(((charIndex - mistake) / 5) / (maxTime - timeLeft) * 60);
        wpm.innerText = wpmVal < 0 || !wpmVal || wpmVal === Infinity ? 0 : wpmVal;
    } else if (textCompleted) {
        clearInterval(timer); // Ensures the timer stops and doesn't reset
        if (isAccuracyPerfect()) {
            showAchievementPopup();
        }
    }
}

function isAccuracyPerfect() {
    const totalChars = charIndex;
    const correctChars = totalChars - mistake;
    const accuracyVal = totalChars ? Math.round((correctChars / totalChars) * 100) : 100;
    return accuracyVal === 100;
}

function updateAccuracy() {
    const totalChars = charIndex;
    const correctChars = totalChars - mistake;
    const accuracyVal = totalChars ? Math.round((correctChars / totalChars) * 100) : 100;
    accuracy.innerText = `${accuracyVal}%`;
}

function updateProgress() {
    const progress = (charIndex / typingText.querySelectorAll('span').length) * 100;
    progressBar.style.width = `${progress}%`;
}

function reset() {
    const difficulty = difficultySelect.value;
    maxTime = difficultyTimes[difficulty]; // Update maxTime based on difficulty
    timeLeft = maxTime;
    time.innerText = timeLeft;
    input.value = '';
    charIndex = 0;
    mistake = 0;
    isTyping = false;
    textCompleted = false;
    wpm.innerText = 0;
    cpm.innerText = 0;
    mistakes.innerText = 0;
    accuracy.innerText = '100%';
    progressBar.style.width = '0%';
    loadParagraph();
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    document.querySelector('.wrapper').classList.toggle('dark-theme');
    document.querySelector('.wrapper').classList.toggle('light-theme');
    document.querySelector('.content button').classList.toggle('dark-theme');
    document.querySelector('.content button').classList.toggle('light-theme');
    document.querySelector('h1').classList.toggle('dark-theme');
    document.querySelector('h1').classList.toggle('light-theme');
}

function showAchievementPopup() {
    if (achievementPopup.classList.contains('hidden')) {
        achievementPopup.classList.remove('hidden');
        popupMessage.innerHTML = `
            <span>🎉 Congratulations! 🎉</span><br>
            <span>You achieved 100% accuracy!</span>
        `;
        achievementPopup.classList.add('pop');
        closePopupButton.addEventListener('click', () => {
            achievementPopup.classList.add('hidden');
            achievementPopup.classList.remove('pop');
        });
        setTimeout(() => {
            if (!achievementPopup.classList.contains('hidden')) {
                achievementPopup.classList.add('hidden');
                achievementPopup.classList.remove('pop');
            }
        }, 5000);
    }
}

input.addEventListener("input", initTyping);
btn.addEventListener("click", reset);
themeToggle.addEventListener("change", toggleTheme);
difficultySelect.addEventListener("change", reset);
loadParagraph();
