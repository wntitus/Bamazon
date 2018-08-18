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

let choicePrompt = function() {
    inquirer.prompt({
        type : 'confirm',
        name : 'contChoice',
        message : 'Continue or exit?',
        default : true
    }).then(function(answer) {
        if (answer.contChoice) {
            run();
        } else {
            return;
        }
    })
}

let run = function() {
    connection.query("SELECT * FROM products", function(error, response) {
        if (error) throw error;
        console.table(response);  
        inquirer.prompt([
            {
                type : 'input',
                name : 'custChoice',
                message : 'Please enter the product ID you would like to purchase.'
            },
            {
                type : 'input',
                name : 'custQuant',
                message : 'Please enter the amount you would like to purchase.'
            }
        ]).then(function(answers) {
            connection.query("SELECT * FROM products WHERE item_id=?", [answers.custChoice], function(error, response) {
                if (error) throw error;
                if (response[0].stock_quantity >= answers.custQuant) {
                    let newCount = response[0].stock_quantity - answers.custQuant;
                    connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newCount, answers.custChoice]);
                    console.log("Product purchased!");
                    choicePrompt();
                } else {
                    console.log("Insufficient quantity!");
                    choicePrompt();
                }
            })
        })
    })


}

run();