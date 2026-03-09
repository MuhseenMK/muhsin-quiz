// script.js – simple, readable, student style

// ---------- data: 10 questions, correct answers ----------
const questions = [
  {
    text: "Does Muhsin currently have a girlfriend?",
    options: ["Yes", "No", "Maybe", "Prefer not to say"],
    correct: "No"
  },
  {
    text: "What is Muhsin’s favorite food?",
    options: ["Alkubus", "Rice and Beans", "Danwake", "Dambu"],
    correct: "Alkubus"
  },
  {
    text: "What is Muhsin’s favorite color?",
    options: ["Blue", "Red", "Black", "Green"],
    correct: "Red"
  },
  {
    text: "Which hobby does Muhsin enjoy the most?",
    options: ["Coding / Programming", "Playing Football", "Watching Anime", "Reciting Quran"],
    correct: "Watching Anime"
  },
  {
    text: "What is Muhsin’s favorite drink?",
    options: ["Tea", "Coke", "Water", "Juice"],
    correct: "Tea"
  },
  {
    text: "How old is Muhsin?",
    options: ["17", "18", "19", "20"],
    correct: "19"
  },
  {
    text: "Which programming language does Muhsin like the most?",
    options: ["Python", "Java", "C++", "HTML / CSS"],
    correct: "Python"
  },
  {
    text: "What is something Muhsin is known for among his friends?",
    options: [
      "Always joking and making people laugh",
      "Being very serious",
      "Sleeping a lot",
      "Always studying"
    ],
    correct: "Always joking and making people laugh"
  },
  {
    text: "Who is Muhsin’s favorite person?",
    options: [
      "His elder sister",
      "His best friend",
      "His cousin",
      "His father"
    ],
    correct: "His elder sister"
  },
  {
    text: "What is something Muhsin does every day that only close friends would know?",
    options: [
      "Drinks tea every day",
      "Stays up late",
      "Always smiles",
      "Writes notes every day"
    ],
    // both answers are correct per spec; but we pick one for checking.
    // the spec says: "Correct answers: Drinks tea every day / Stays up late"
    // we'll accept either as correct – but radio can only pick one. 
    // we'll implement a custom check: if either "Drinks tea every day" or "Stays up late" is selected, count as correct.
    // So we treat it as two possible correct values.
    correct: ["Drinks tea every day", "Stays up late"]   // array for special case
  }
];

// ---------- DOM elements ----------
const welcomeSection = document.getElementById('welcome-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');
const displayNameSpan = document.getElementById('display-name');
const quizForm = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-quiz');
const scoreDisplay = document.getElementById('score-display');
const feedbackMsg = document.getElementById('feedback-message');
const userMessageTextarea = document.getElementById('user-message');
const sendWhatsappBtn = document.getElementById('send-whatsapp');
const restartBtn = document.getElementById('restart-btn');

let currentUserName = "Anonymous";

// ---------- render quiz questions dynamically ----------
function renderQuestions() {
  let html = '';
  questions.forEach((q, idx) => {
    const questionNumber = idx + 1;
    // if correct is an array (for question #10), we still display normally
    html += `<div class="question-block" data-qidx="${idx}">`;
    html += `<div class="question-text">${questionNumber}. ${q.text}</div>`;
    html += `<div class="options">`;

    q.options.forEach(opt => {
      const radioId = `q${idx}_${opt.replace(/\s+/g, '')}`;
      html += `<div class="option-item">`;
      html += `<input type="radio" name="q${idx}" value="${opt}" id="${radioId}">`;
      html += `<label for="${radioId}">${opt}</label>`;
      html += `</div>`;
    });

    html += `</div></div>`; // close options, question-block
  });
  quizForm.innerHTML = html;
}

// ---------- calculate score ----------
function calculateScore() {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    const radios = document.getElementsByName(`q${i}`);
    let selectedValue = null;
    for (let radio of radios) {
      if (radio.checked) {
        selectedValue = radio.value;
        break;
      }
    }
    if (!selectedValue) continue; // no answer = skip

    const question = questions[i];
    // check if question has array of correct answers (question #10)
    if (Array.isArray(question.correct)) {
      if (question.correct.includes(selectedValue)) {
        score++;
      }
    } else {
      if (selectedValue === question.correct) {
        score++;
      }
    }
  }
  return score;
}

// ---------- feedback based on score ----------
function getFeedback(score) {
  if (score >= 9) return "Wow! You really know Muhsin.";
  if (score >= 6) return "Not bad. You know Muhsin quite well.";
  return "Hmm… maybe you should spend more time with Muhsin.";
}

// ---------- show result section with score ----------
function showResult(score) {
  const total = questions.length;
  scoreDisplay.textContent = `${score} / ${total}`;
  feedbackMsg.textContent = getFeedback(score);

  // hide quiz/welcome, show result
  welcomeSection.classList.add('hidden');
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
}

// ---------- handle start quiz ----------
startBtn.addEventListener('click', () => {
  let name = usernameInput.value.trim();
  if (name === '') {
    currentUserName = 'Anonymous';
  } else {
    currentUserName = name;
  }
  displayNameSpan.textContent = `🧑‍🎓 ${currentUserName}`;

  // render questions if not already rendered (but always re-render to be clean)
  renderQuestions();

  // switch views
  welcomeSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  resultSection.classList.add('hidden');
});

// ---------- handle quiz submit ----------
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();   // no actual form submit

  const score = calculateScore();
  showResult(score);
});

// ---------- restart (take again) ----------
restartBtn.addEventListener('click', () => {
  // clear inputs
  usernameInput.value = '';
  userMessageTextarea.value = '';
  // reset any checked radios by re-rendering (so form is fresh)
  renderQuestions();

  // go back to welcome
  welcomeSection.classList.remove('hidden');
  quizSection.classList.add('hidden');
  resultSection.classList.add('hidden');
});

// ---------- send whatsapp ----------
sendWhatsappBtn.addEventListener('click', () => {
  // get score from displayed text (e.g. "7 / 10")
  const scoreText = scoreDisplay.textContent;   // "7 / 10"
  const userMsg = userMessageTextarea.value.trim() || '(no message)';

  // phone number: 09112473302 → Nigeria code 234
  const phone = '2349112473302';   // without '+'
  const baseUrl = `https://wa.me/${phone}?text=`;

  // construct message
  let fullMessage = `Name: ${currentUserName}\nScore: ${scoreText}\nMessage:\n${userMsg}`;

  // encode for URL
  const encoded = encodeURIComponent(fullMessage);
  const waLink = baseUrl + encoded;

  // open WhatsApp (web or app)
  window.open(waLink, '_blank');
});

// ---------- initial render on page load (so questions exist if user clicks start) ----------
renderQuestions();

// (optional) prefill nothing, all sections in correct state: welcome visible.