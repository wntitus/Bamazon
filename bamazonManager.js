const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'root',
    database : 'bamazon'
});

let run = function() {
    inquirer.prompt({
        type : 'list',
        name : 'managerChoice',
        message : 'Please make a selection.',
        choices : [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product'
        ]
    }).then(function(answer) {
        if (answer.managerChoice === 'View Products for Sale') {
            connection.query('SELECT * FROM products', function(error, response) {
                if (error) throw error;
                console.table(response);
                run();
            })
        } else if (answer.managerChoice === 'View Low Inventory') {
            connection.query('SELECT * FROM products WHERE stock_quantity<5', function(error, response) {
                if (error) throw error;
                console.table(response);
                run();
            })
        }
    })
}

run();