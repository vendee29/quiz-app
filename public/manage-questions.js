'use strict';

fetchQuestions('/api/questions');

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
