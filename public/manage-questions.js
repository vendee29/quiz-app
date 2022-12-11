'use strict';

// render all questions

fetchQuestions('/api/questions');

// render form for adding a new question

let form = document.querySelector('form');
let message = document.querySelector('.message');


form.addEventListener('submit', (event) => {
    event.preventDefault();

    let correctAnswer = document.querySelector('input[name="is_correct"]:checked').value;
    let answers = [form.answer_1.value, form.answer_2.value, form.answer_3.value, form.answer_4.value]
    let finalAnswers = getAnswers(answers, correctAnswer);

    let values = {
        question: form.question.value,
        answers: finalAnswers
    }

    fetchQuestion(values)
    .then(data => {
        message.innerText = `Your question has been submitted with the id ${data[0].question_id}.`;
        clearForm();
    })
    .catch(err => console.log(err));

})

// HELPER FUNCTIONS

//create question

function createQuestion() {
    let divForQuestions = document.querySelector('.questions');

    let divForOne = document.createElement('div');
    divForOne.classList.add('question');

    let p = document.createElement('p');

    let button = document.createElement('button');
    button.classList.add('delete');
    button.innerText = 'delete';

    divForOne.appendChild(p);
    divForOne.appendChild(button);
    divForQuestions.appendChild(divForOne);
};

// delete question

async function fetchDelete(api) {
    let response = await fetch(api, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json();
};

// fetch questions

async function fetchQuestions(api) {

    try {
    
        let response = await fetch(api);
        let questions = await response.json();

        for(let i = 0; i < questions.length; i++) {
            createQuestion()
            let questionsPar = document.querySelectorAll('.questions p');
            questionsPar[i].innerText = questions[i].question;

            //////////////////// DELETING QUESTIONS ///////////////////

            let deleteBtns = document.querySelectorAll('.delete');

            deleteBtns[i].addEventListener('click', (event) => {
                event.preventDefault();
                console.log(`You want to delete question: ${questions[i].question}`);
                fetchDelete(`/api/questions/${questions[i].id}`)
                .then(message => {
                    alert(message.message);
                    location.reload();
                });
            })
        }
    } catch (err) {
        console.log(err)}
}

// form

function getAnswers(answers, correctAnswer) {
    let finalAnswers = [];

    for(let i = 0; i < answers.length; i++) {
        let oneAnswer = {};
        oneAnswer[`answer_${i + 1}`] = answers[i];
       
        if(i + 1 == correctAnswer) {
            oneAnswer['is_correct'] = 1;
        } else {
            oneAnswer['is_correct'] = 0;
        }
        finalAnswers.push(oneAnswer);
    }

    return finalAnswers;
}

function clearForm() {
    let questionInput = document.querySelector('#question');
    let answer1Input = document.querySelector('#answer_1');
    let answer2Input = document.querySelector('#answer_2');
    let answer3Input = document.querySelector('#answer_3');
    let answer4Input = document.querySelector('#answer_4');

    questionInput.value = '';
    answer1Input.value = '';
    answer2Input.value = '';
    answer3Input.value = '';
    answer4Input.value = '';
}

async function fetchQuestion(values) {
    let response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
    return await response.json();
}