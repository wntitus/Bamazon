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
            'Add New Product',
            'Exit'
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
        } else if (answer.managerChoice === 'Add to Inventory') {
            inquirer.prompt([
                {
                    type : 'input',
                    name : 'addID',
                    message : 'Enter the ID of the item you would like to add.'
                },
                {
                    type : 'input',
                    name : 'addQuant',
                    message : 'How many would you like to add?'
                }
            ]).then(function(answers) {
                connection.query('SELECT * FROM products WHERE item_id=?', [answers.addID], function(error, response) {
                    if (error) throw error;
                    let newQuant = parseInt(answers.addQuant) + response[0].stock_quantity;
                    connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [newQuant, answers.addID]);
                    console.log("Product added!");
                    run();
                })
            })
        } else if (answer.managerChoice === 'Add New Product') {
            inquirer.prompt([
                {
                    type : 'input',
                    name : 'productName',
                    message : 'What is the name of the product you would like to add?'
                },
                {
                    type : 'input',
                    name : 'productDept',
                    message : 'What department is this product in?'
                },
                {
                    type : 'input',
                    name : 'productPrice',
                    message : 'What price will this product be set at?'
                },
                {
                    type : 'input',
                    name : 'productStock',
                    message : 'How much of this product is in stock?'
                }
            ]).then(function(answers) {
                connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)', [answers.productName, answers.productDept, parseFloat(answers.productPrice), parseInt(answers.productStock)]);

                console.log("Product successfully added!");
                run();
            })
        } else if (answer.managerChoice === 'Exit') {
            process.exit();
        }
    })
}

run();