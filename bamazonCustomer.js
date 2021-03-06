const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'root',
    database : 'bamazon'
});

let choicePrompt = function() {
    inquirer.prompt({
        type : 'list',
        name : 'contChoice',
        message : 'Continue or exit?',
        choices : [
            'Continue',
            'Exit'
        ]
    }).then(function(answer) {
        if (answer.contChoice === 'Continue') {
            run();
        } else {
            process.exit();
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
                message : chalk.blue('Please enter the product ID you would like to purchase.')
            },
            {
                type : 'input',
                name : 'custQuant',
                message : chalk.blue('Please enter the amount you would like to purchase.')
            }
        ]).then(function(answers) {
            connection.query("SELECT * FROM products WHERE item_id=?", [answers.custChoice], function(error, response) {
                if (error) throw error;
                if (response[0].stock_quantity >= answers.custQuant) {
                    let newCount = response[0].stock_quantity - answers.custQuant;
                    let cost = answers.custQuant * response[0].price;
                    let salesCost = response[0].product_sales + cost;
                    connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newCount, answers.custChoice]);
                    connection.query("UPDATE products SET product_sales=? WHERE item_id=?", [salesCost, answers.custChoice]);
                    console.log(chalk.red("Product purchased!"));
                    console.log(chalk.red("Total cost: " + parseFloat(cost)));
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