const question = document.querySelector("#question");
const options = document.querySelector(".options");
const progressText = document.querySelector("#progressText");
const progressBarFull = document.querySelector("#progressBarFull");
const scoreText = document.querySelector("#score");

let correctAnswer = "";
let correctScore = 0;
let askedCount = 0;
let totalQuestions = 10;
let score = 0;

const SCORE_POINTS = 100;

document.addEventListener("DOMContentLoaded", () => {
  score = 0;
  loadQuestion(), totalQuestions;
  progressText.textContent = `Question ${correctAnswer} of ${totalQuestions}`;
});

async function loadQuestion() {
  const APIUrl =
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();

  //   console.log(data);
  showQuestion(data.results[0]);
  checkCount();
}

function showQuestion(data) {
  correctAnswer = data.correct_answer;
  let incorrectAnswers = data.incorrect_answers;
  let optionsList = incorrectAnswers;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswers.length + 1)),
    0,
    correctAnswer
  );
  let triviaQuestion = HTMLDecode(data.question);
  question.textContent = triviaQuestion;
  options.innerHTML = `${optionsList
    .map(
      (option, index) => `<div class="choice-container">
  <p class="choice-prefix">${index + 1}</p>
  <p class="choice-text" data-number="${index + 1}">${option}</p>
</div>`
    )
    .join("")}`;
  selectOption();
}

function selectOption() {
  options.querySelectorAll(".choice-container").forEach((option) => {
    option.addEventListener("click", (e) => {
      let selectedAnswer = e.target.textContent;
      let selectedChoice = e.target;

      let classToApply =
        selectedAnswer === correctAnswer ? "correct" : "incorrect";

      if (classToApply === "correct") {
        incrementScore(SCORE_POINTS);
      }

      selectedChoice.parentElement.classList.add(classToApply);

      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        loadQuestion();
      }, 1000);
    });
  });
}

function checkCount() {
  askedCount++;
  progressText.textContent = `Question ${askedCount} of ${totalQuestions}`;
  progressBarFull.style.width = `${(askedCount / totalQuestions) * 100}%`;

  if (askedCount > totalQuestions) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("/end.html");
  }
}

function HTMLDecode(textstring) {
  let doc = new DOMParser().parseFromString(textstring, "text/html");
  return doc.documentElement.textContent;
}

incrementScore = (num) => {
  score += num;
  scoreText.textContent = score;
};
