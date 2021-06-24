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
          viewEmployees();
          break;

        case "View All Employees By Role":
          viewRoles();
          break;

        case "View all Employees By Deparment":
          viewDepartments();
          break;

        case "View All Employees By Manager":
          viewManagers();
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

// view employees
const viewEmployees = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS Department, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on role.department_id = department.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};

// view roles
const viewRoles = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};

// view daprtments
const viewDepartments = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id",
    (err, res) => {
      if (err) throw err;
      startPrompt();
    }
  );
};

// add employee
const addEmployee = () => {};

// remove employee
const removeEmployee = () => {};

// update employee
const updateEmployee = () => {};

// update role
const updateRole = () => {};

// update department
const updateDepartment = () => {};

// connection ID
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as Id" + connection.threadId);
  startPrompt();
});
