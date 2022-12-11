'use strict';

// HELPER FUNCTIONS

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
}