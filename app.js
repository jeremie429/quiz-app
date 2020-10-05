(function () {

  //https://opentdb.com/api.php?amount=1&category=24&difficulty=easy
  //https://opentdb.com/api.php?amount=1
  const baseURL = "https://opentdb.com/api.php?amount=1&category=24&difficulty=easy";
  const containerEl = document.querySelector(".container");
  const form = document.querySelector("#quiz-form");
  const questEl = document.querySelector(".qus");

  const optionEl = document.querySelector(".all_options");

  const buttonEl = document.querySelector(".buttons");
  const scoreEl = document.querySelector(".scoreboard .score-num");

  const answerEl = document.querySelector(".scoreboard .answer-num");

  let question, answer;
  let options = [];
  let score = 0;
  let answeredQus = 0;

  window.addEventListener("DOMContentLoaded", quizApp);

  async function quizApp() {
    updateScoreBoard();
    const data = await fetchQuiz();

    question = data[0].question;
    options = [];
    answer = data[0].correct_answer;
    data[0].incorrect_answers.map((option) => options.push(option));

    options.splice(Math.floor(Math.random() * options.length + 1), 0, answer);
    //console.log(options);

    generateTemplate(question, options);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.quiz.value) {
      checkQuiz(e.target.quiz.value);
      e.target.querySelector("button").style.display = "none";
      generateButtons();
    } else {
      return;
    }
  });

  async function fetchQuiz() {
    const response = await fetch(baseURL);
    const data = await response.json();

    return data.results;
  }

  function generateTemplate(question, options) {
    optionEl.innerHTML = "";
    questEl.innerHTML = question;

    options.map((option, i) => {
      const item = document.createElement("div");
      item.classList.add("option");
      item.innerHTML = `
              <label for="option${i + 1}">${option}</label>
              <input type="radio" name="quiz" id="option${i + 1
        }" value="${option}" />
        `;

      optionEl.appendChild(item);
    });
  }

  function checkQuiz(selected) {
    answeredQus++;
    if (selected === answer) {
      score++;
    }

    updateScoreBoard();
    form.quiz.forEach((input) => {
      if (input.value === answer) {
        input.parentElement.classList.add("correct");
      }
    });
  }

  function updateScoreBoard() {
    scoreEl.innerHTML = score;
    answerEl.innerHTML = answeredQus;
  }

  function generateButtons() {
    const finishButton = document.createElement("button");
    finishButton.innerText = "Finish";
    finishButton.setAttribute("type", "button");
    finishButton.classList.add("finish-btn");
    buttonEl.appendChild(finishButton);

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next Quiz";
    nextBtn.setAttribute("type", "button");
    nextBtn.classList.add("next-btn");
    buttonEl.appendChild(nextBtn);

    finishButton.addEventListener("click", finishQuiz);
    nextBtn.addEventListener("click", getNextQuiz);
  }

  function getNextQuiz() {
    const nextBtn = document.querySelector(".next-btn");
    const finishBtn = document.querySelector(".finish-btn");
    buttonEl.removeChild(nextBtn);
    buttonEl.removeChild(finishBtn);

    buttonEl.querySelector("button[type=submit]").style.display = "block";

    quizApp();
  }

  function finishQuiz() {
    const nextBtn = document.querySelector(".next-btn");
    const finishBtn = document.querySelector(".finish-btn");
    buttonEl.removeChild(nextBtn);
    buttonEl.removeChild(finishBtn);

    buttonEl.querySelector("button[type=submit]").style.display = "block";

    const overlay = document.createElement("div");
    overlay.classList.add("result-overlay");
    overlay.innerHTML = `
        <div class="final-result">${score}/${answeredQus}</div>
        <button>Play Again</button>
    `;
    containerEl.appendChild(overlay);
    overlay.querySelector("button").addEventListener("click", () => {
      containerEl.removeChild(overlay);
      playAgain();
    });
  }

  function playAgain() {
    score = 0;
    answeredQus = 0;
    quizApp();
  }
})();
