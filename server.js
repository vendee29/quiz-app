'use strict';

const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 8080;

module.exports = app;

app.use(express.json());
app.use(express.static('public'));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'quiz_app',
});

// establishing a connection with the database

conn.connect((err) => { 
    if(err) {
		console.log(err, `The database connection couldn't be established`);
		return;
	} else {
		console.log(`Connection established`);
	}
});

// GET renders a static HTML, as a game page

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/main.html');
});

// GET renders a static HTML, as a manage questions page

app.get('/questions', (req, res) => {
    res.sendFile(__dirname + '/public/manage-questions.html');
});

// GET returns a random question with its answers

app.get('/api/game', (req, res) => {

    getRandomQuestion()
    .then(result => {
        let { question, answers } = result;
        question.answers = answers
        res.status(200).json(question)
    })
    .catch(err => console.log(err))
})

// GET returns all the questions

app.get('/api/questions', (req, res) => {
    queryDb('SELECT * FROM questions')
    .then(rows => {
        res.status(200).json(rows);
    })
    .catch(err => console.log(err))
})

// POST adds a new question and its answers

app.post('/api/questions', (req, res) => {
    let { question, answers } = req.body;
    
    addQuestion(question, answers)
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
})

// PORT LISTENING

app.listen(port, () => {
    console.log(`The server is up and running on ${port}`);
});

// HELPER FUNCTIONS

// querying database

function queryDb(sqlQuery, valuesArr) {
    return new Promise((resolve, reject) => {
        conn.query(sqlQuery, valuesArr, (err, result) => {
            if(err) {
                return reject('DATABASE ERROR');
            } else {
                return resolve(result);
            }
        })
    }) 
}

// getting random question

async function getRandomQuestion() {
    let questions = await queryDb(`SELECT * FROM questions`);
    let questionId = Math.ceil(Math.random() * questions.length);
    let question = questions[questionId - 1];
    let answers = await queryDb(`SELECT * FROM answers WHERE question_id = ?`, [question.id]);
    return { question, answers };
}

// adding new question

async function addQuestion(question, answers) {  
    let arrAnswers = [answers[0].answer_1, answers[1].answer_2, answers[2].answer_3, answers[3].answer_4]
    let arrIsCorrect = answers.map(answer => answer.is_correct);

    let insert = await queryDb('INSERT INTO questions (question) VALUES (?)', [question]);
    let questionId = insert.insertId;
    for(let i = 0; i < answers.length; i++) {
        await queryDb(`INSERT INTO answers (question_id, answer, is_correct) VALUES (?, ?, ?)`, [questionId, arrAnswers[i], arrIsCorrect[i]]);
    }
    return await queryDb(`SELECT question, question_id, answer FROM questions JOIN answers ON questions.id = question_id WHERE questions.id = ? AND is_correct = ?`, [questionId, 1]);
}

// deleting question

async function deleteQuestion(id) {
    await queryDb(`DELETE FROM answers WHERE question_id = ?`, [id]);
    await queryDb(`DELETE FROM questions WHERE id = ?`, [id]);
    return {
        message: 'The question and its answers were deleted.'
    }
}