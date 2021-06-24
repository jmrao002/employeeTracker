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

// global things
let roles = [];
let managers = [];

// function for inquirer prompts
const startPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "View all employees",
          "View employees by role",
          "View employees by department",
          "Add employee",
          "Add role",
          "Add department",
          "Update employee role",
          "Quit",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case "View all employees":
          viewEmployees();
          break;

        case "View employees by role":
          viewEmpRoles();
          break;

        case "View employees by department":
          viewEmpDepartments();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Add role":
          addRole();
          break;

        case "Add department":
          addDepartment();
          break;

        case "Update employee role":
          updateRole();
          break;

        case "Quit":
          quit();
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
const viewEmpRoles = () => {
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
const viewEmpDepartments = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id",
    (err, res) => {
      if (err) throw err;
      startPrompt();
    }
  );
};

// view all roles for add employee function
const viewRoles = () => {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }
  });
  return roles;
};

// view all managers for add employee function
const viewManagers = () => {
  connection.query(
    'SELECT first_name, last_name FROM employee WHERE manager_id != "1"',
    (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        // do i need [i] here?
        managers.push(res[i]);
      }
    }
  );
  return managers;
};

// add employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: viewRoles(),
      },
      {
        type: "rawlist",
        name: "manager",
        message: "What is the employee's manager's name?",
        choices: viewManagers(),
      },
    ])
    .then(function (val) {
      let roleId = viewRoles().indexOf(val.role) + 1;
      let managerId = viewManager().indexOf(val.choice) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId,
        },
        (err, res) => {
          if (err) throw err;
          console.table(val);
          startPrompt();
        }
      );
    });
};

// add employee role
const addRole = () => {};

// add employee department
const addDepartment = () => {};

// update employee role
const updateRole = () => {};

// quit
const quit = () => {
  process.exit();
};

// connection ID
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as Id" + connection.threadId);
  startPrompt();
});
