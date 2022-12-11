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
})