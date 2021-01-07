var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    runAll();
});

async function runAll() {
    await showData();
    let item = await runSearch();
    await askQuantity(item[0]);

}

function showData() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM products", function (err, results) {
            if (err) {
                reject(err);
            }
            console.table(JSON.parse(JSON.stringify(results)));
            resolve();
        });
    });

}
function runSearch() {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt({
                name: "id",
                type: "list",
                message: "What is the id of the product you would like to buy?",
                choices: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10"
                ]
            })
            .then(function (answer) {
                console.log(answer.id);
                connection.query("SELECT * FROM products where item_id=" + answer.id, function (err, results) {
                    if (err) {
                        throw err;
                    }
                    console.table(JSON.parse(JSON.stringify(results)));
                    return resolve(JSON.parse(JSON.stringify(results)));

                })
            });
    });

}

function askQuantity(item) {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt({
                name: "quantity",
                type: "input",
                message: "How many of the product would you like?",
            })
            .then(function (answer) {
                var userQuantity = answer.quantity;
                if (userQuantity <= item.stock_quantity) {
                    console.log("Order Placed!");
                    var newQuantity = item.stock_quantity - userQuantity;
                    connection.query("UPDATE products set stock_quantity=" + newQuantity + " where item_id=" + item.item_id, function (err, results) {
                        if (err) {
                            throw err;

                        }
                        var cost = userQuantity * item.price;
                        console.log("Your total cost is $" + cost);


                    })
                } else {
                    console.log("Insufficient quantity!");
                }

            });
    });
}
