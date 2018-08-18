const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3036,
    user : 'root',
    password : 'root',
    database : 'bamazon'
})