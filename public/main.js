'use strict';

setCurrentScore();

fetchRandomQuestion()
.then(question => {
    renderQuestion();
    let mainQuestion = document.querySelector('.question h3');
    let answers = document.querySelectorAll('.answers button');

    mainQuestion.textContent = question.question;

    for(let i = 0; i < answers.length; i++) {
        answers[i].textContent = question.answers[i].answer;

        answers[i].addEventListener('click', (event) => {
            event.preventDefault();

            clearInterval(myTimer);

            if(question.answers[i].is_correct == 1) {
                answers[i].setAttribute('style', 'background-color: #27AE60');
                changeScore(1);
                waitForReload(2000);
            } else {
                answers[i].setAttribute('style', 'background-color: #E86370');
                waitForCorrectAnswer(1000, question.answers, answers);
                changeScore(-1);
                waitForReload(2000);
            }
        })
    }
})
.catch(err => console.log(err));

// Timer

let timer = document.querySelector('.timer-count');
let counter = 9;
function timerHandler() {
    timer.textContent = counter;
    counter--;

    if(counter == -1) {
        changeScore(-1);
        location.reload();
    }
}

let myTimer = setInterval(timerHandler, 1000);

let stopTimer = document.querySelector('.clear-time');

stopTimer.addEventListener('click', (event) => {
    event.preventDefault();

    if(stopTimer.textContent == 'Stop timer') {
        stopTimer.innerText = 'Reset timer'
        clearInterval(myTimer);
        console.log('change to Reset timer')
        
    } else {
        console.log('change to Stop timer')
        stopTimer.textContent = 'Stop timer';
        setInterval(timerHandler, 1000);
        myTimer;
    }
})

// HELPER FUNCTIONS

// QUESTION

async function fetchRandomQuestion() {
    let response = await fetch('/api/game');
    return await response.json();
}

function renderQuestion() {
    let questionSection = document.querySelector('.question');
    let mainQuestion = document.createElement('h3');
    let answer1 = document.createElement('button');
    let answer2 = document.createElement('button');
    let answer3 = document.createElement('button');
    let answer4 = document.createElement('button');

    let answers = document.createElement('div');
    answers.classList.add('answers');

    answers.appendChild(answer1);
    answers.appendChild(answer2);
    answers.appendChild(answer3);
    answers.appendChild(answer4);

    questionSection.appendChild(mainQuestion);
    questionSection.appendChild(answers);
}

function markCorrectAnswer(answersFromData, layoutAnswers) {
    return new Promise(resolve => {
        for(let i = 0; i < answersFromData.length; i++) {
            if(answersFromData[i].is_correct == 1) {
                layoutAnswers[i].setAttribute('style', 'background-color: #27AE60');
            }
        } 
    })      
}

// SCORE

function setScore(score) {
    let currentScore = document.querySelector('.score-count');
    localStorage.setItem('score', score);
    currentScore.textContent = score;
}

function changeScore(plusOrMinus) {
    let currentScore = parseInt(localStorage.getItem('score'));
    currentScore += (plusOrMinus);
    setScore(currentScore);
}

function setCurrentScore() {
    let currentScore = parseInt(localStorage.getItem('score'));
    setScore(currentScore)
}

function resetScore() {
    let currentScore = document.querySelector('.score-count');
    localStorage.setItem('score', 0);
    currentScore.textContent = 0;
}

let resetBtn = document.querySelector('.reset');

resetBtn.addEventListener('click', (event) => {
    event.preventDefault();
    resetScore()
})

// TIMEOUT

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function reload() {
    return new Promise(resolve => location.reload())
}

async function waitForCorrectAnswer(ms, answersFromData, layoutAnswers) {
    await timeout(ms);
    await markCorrectAnswer(answersFromData, layoutAnswers)
}

async function waitForReload(ms) {
    await timeout(ms);
    await reload()
}