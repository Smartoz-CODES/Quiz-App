// ================ QUIZ APP ================

// ===== Storing the quiz questions =====
const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Trainer Marking Language",
      "HyperText Markup Language",
      "HyperText Marketing Language",
      "HyperText Markup Leveler",
    ],
    correct: 1,
  },
  {
    question: "Which CSS property is used to change text color?",
    answers: ["font-color", "text-color", "color", "foreground-color"],
    correct: 2,
  },
  {
    question: "What does the === operator do in JavaScript?",
    answers: [
      "Assigns a value",
      "Compares value only",
      "Compares value and type",
      "Declares a variable",
    ],
    correct: 2,
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    answers: ["<link>", "<href>", "<a>", "<url>"],
    correct: 2,
  },
  {
    question: "What is the correct way to declare a JavaScript variable?",
    answers: [
      "variable name = value",
      "var name = value",
      "v name = value",
      "declare name = value",
    ],
    correct: 1,
  },
  {
    question: "Which tag is used to add an image in HTML?",
    answers: ["<picture>", "<img>", "<image>", "<src>"],
    correct: 1,
  },
  {
    question: "What does CSS stand for?",
    answers: [
      "Computer Style Sheets",
      "Creative Style System",
      "Cascading Style Sheets",
      "Colorful Style Sheets",
    ],
    correct: 2,
  },
  {
    question: "Which JavaScript method is used to write to the browser console?",
    answers: [
      "console.write()",
      "console.log()",
      "console.print()",
      "console.output()",
    ],
    correct: 1,
  },
  {
    question: "What does the 'let' keyword do in JavaScript?",
    answers: [
      "Creates a constant",
      "Creates a function",
      "Declares a block-scoped variable",
      "Imports a module",
    ],
    correct: 2,
  },
  {
    question: "Which CSS property controls the space between elements?",
    answers: ["spacing", "gap", "margin", "border"],
    correct: 2,
  },
];

// ===== STEP 2: Tracking the quiz state =====
// Variables that helps keep track of where we are in the quiz.

let currentQuestionIndex = 0; // Which question we're on (starts at 0)
let score = 0; // How many correct answers
let hasAnswered = false; // Has the user answered the current question?

// NEW: Array to store user's selected answers for each question
// -1 means "not answered yet", any other number is the selected answer index
let userAnswers = new Array(questions.length).fill(-1);

// ===== STEP 3: Grabing all the HTML elements needed =====

const questionText = document.querySelector(".quiz-question-text");
const answersContainer = document.querySelector(".quiz-answers");
const progressText = document.querySelector(".quiz-progress-text");
const progressFill = document.querySelector(".quiz-progress-fill");
const feedbackText = document.querySelector(".quiz-feedback");
const nextBtn = document.querySelector(".quiz-next-btn");
const backBtn = document.querySelector(".quiz-back-btn");
const resultScreen = document.querySelector(".quiz-result");
const resultScore = document.querySelector(".quiz-result-score");
const resultMessage = document.querySelector(".quiz-result-message");
const restartBtn = document.querySelector(".quiz-restart-btn");

// ===== STEP 4: Loading question into the browser page =====
// It checks if the user already answered a certain question
// It also restores their previous selection if they navigate back.

function loadQuestion() {
  // Get the current question object from our array
  const currentQuestion = questions[currentQuestionIndex];

  // Check if this question was already answered before [for back navigation]
  const previousAnswer = userAnswers[currentQuestionIndex];
  hasAnswered = previousAnswer !== -1;

  // Update the question text
  questionText.textContent = currentQuestion.question;

  // Update progress text
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  // Update progress bar width
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;

  // Reset feedback
  feedbackText.textContent = "";
  feedbackText.className = "quiz-feedback";

  // Clear old answer buttons
  answersContainer.innerHTML = "";

  // Create new answer buttons for each option
  currentQuestion.answers.forEach(function (answer, index) {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("quiz-answer-btn");
    button.dataset.index = index;

    // If this question was already answered, restore the visual state
    if (hasAnswered) {
      // Disable all buttons since question is already answered
      button.classList.add("disabled");

      // Highlight the previously selected answer
      if (index === previousAnswer) {
        // Check if the previous answer was correct or wrong
        if (previousAnswer === currentQuestion.correct) {
          button.classList.add("correct");
        } else {
          button.classList.add("wrong");
        }
      }
    } else {
      // Question not answered yet — add click event
      button.addEventListener("click", function () {
        checkAnswer(index);
      });
    }

    answersContainer.appendChild(button);
  });

  // Show correct feedback if this question was previously answered correctly
  if (hasAnswered && previousAnswer === currentQuestion.correct) {
    feedbackText.textContent = "Correct! Well done! \u{1F389}";
    feedbackText.className = "quiz-feedback correct";
  }

  // Enable/disable Next button based on whether question is answered
  nextBtn.disabled = !hasAnswered;

  // Update Next button text for the last question
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.textContent = "See Results";
  } else {
    nextBtn.textContent = "Next Question";
  }

  // Enable/disable Back button — disabled on first question
  backBtn.disabled = currentQuestionIndex === 0;
}

// ===== STEP 5: Checking the user's answer =====
// Stores the user's answer in the userAnswers array
// so it persists when navigating back and forth.
// Score is only counted once per question.

function checkAnswer(selectedIndex) {
  // Prevent multiple answers per question
  if (hasAnswered) return;
  hasAnswered = true;

  // Store the user's answer for this question (for persistence)
  userAnswers[currentQuestionIndex] = selectedIndex;

  // Get the current question to find the correct answer
  const currentQuestion = questions[currentQuestionIndex];
  const correctIndex = currentQuestion.correct;

  // Get all answer buttons
  const allButtons = document.querySelectorAll(".quiz-answer-btn");

  // Check if the selected answer is correct
  if (selectedIndex === correctIndex) {
    // Correct answer — highlight green and show feedback
    allButtons[selectedIndex].classList.add("correct");
    feedbackText.textContent = "Correct! Well done! \u{1F389}";
    feedbackText.className = "quiz-feedback correct";
  } else {
    // Wrong answer — only highlight the selected answer as wrong
    allButtons[selectedIndex].classList.add("wrong");
  }

  // Disable all buttons so user can't change their answer
  allButtons.forEach(function (button) {
    button.classList.add("disabled");
  });

  // Enable the Next button so user can move forward
  nextBtn.disabled = false;

  // If this is the last question, change button text to "See Results"
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.textContent = "See Results";
  }
}

// ===== STEP 6: Moving to the next question =====

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    // Calculate score from userAnswers before showing results
    // Score is calculated once at the end
    calculateScore();
    showResult();
  } else {
    loadQuestion();
  }
}

// Moves to the previous question and restores the user's previous answer.

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}

// ===== Calculating final score =====
// To prevent double-counting, calculate it once at the end
// by comparing all stored answers to the correct answers.

function calculateScore() {
  score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].correct) {
      score++;
    }
  }
}

// ===== STEP 7: Showing the final result screen =====

function showResult() {
  // Hide the quiz elements
  document.querySelector(".quiz-progress").classList.add("hidden");
  document.querySelector(".quiz-question").classList.add("hidden");
  answersContainer.classList.add("hidden");
  feedbackText.classList.add("hidden");
  document.querySelector(".quiz-nav-buttons").classList.add("hidden");

  // Show the result screen
  resultScreen.classList.remove("hidden");

  // Display the score
  resultScore.textContent = `You scored ${score} out of ${questions.length}`;

  // Show a message based on performance
  const percentage = (score / questions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect score! You really know your stuff! \u{1F525}";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good job! You have a solid foundation. Keep learning! \u{1F4AA}";
  } else {
    resultMessage.textContent = "Keep practicing! Every expert was once a beginner. \u{1F4DA}";
  }
}

// ===== STEP 8: Restart the quiz =====
// Updated: Also resets the userAnswers array.

function restartQuiz() {
  // Reset tracking variables
  currentQuestionIndex = 0;
  score = 0;
  hasAnswered = false;

  // Reset stored answers — fill all with -1 (unanswered)
  userAnswers = new Array(questions.length).fill(-1);

  // Reset button text
  nextBtn.textContent = "Next Question";

  // Show quiz elements again
  document.querySelector(".quiz-progress").classList.remove("hidden");
  document.querySelector(".quiz-question").classList.remove("hidden");
  answersContainer.classList.remove("hidden");
  feedbackText.classList.remove("hidden");
  document.querySelector(".quiz-nav-buttons").classList.remove("hidden");

  // Hide result screen
  resultScreen.classList.add("hidden");

  // Load the first question
  loadQuestion();
}

// ===== STEP 9: Event listeners =====
// Updated: Added Back button listener.

nextBtn.addEventListener("click", nextQuestion);
backBtn.addEventListener("click", previousQuestion);
restartBtn.addEventListener("click", restartQuiz);

// ===== STEP 10: Start the quiz =====

loadQuestion();