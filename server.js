// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_trackerDB",
});

const startPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "View All Employees",
          "View All Employees By Role",
          "View all Emplyees By Deparment",
          "View all Emplyees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Department",
          "Update Employee Manager",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Employees By Role":
          viewAllRoles();
          break;

        case "View all Emplyees By Deparment":
          viewAllDepartments();
          break;

        case "View All Employees By Manager":
          viewAllManagers();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Department":
          updateDepartment();
          break;

        case "Update Employee Manager":
          updateManager();
          break;
      }
    });
};

// view all employees
const viewAllEmployees = () => {
  connection.query("");
};

// connection ID
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as Id" + connection.threadId);
  startPrompt();
});
