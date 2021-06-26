// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "MyNewPass",
  database: "employee_trackerDB",
});

// arrays for use
let roles = [];
let managers = [];
let departments = [];
let employeesFL = [];

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
    .then((answer) => {
      switch (answer.prompts) {
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
          connection.end();
          break;
        default:
          break;
      }
    });
};

// view employees
const viewEmployees = () => {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.id, department.department_name AS "department", employee.manager_id FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      loadPrompts();
    }
  );
};

// view roles
const viewEmpRoles = () => {
  connection.query(
    "SELECT role.title AS Title, employee.first_name, employee.last_name FROM employee JOIN role ON employee.role_id = role.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};

// view departments
const viewEmpDepartments = () => {
  connection.query(
    "SELECT department.department_name AS Department, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id",
    (err, res) => {
      if (err) throw err;
      startPrompt();
    }
  );
};

// view all roles for addEmployee and updateRole functions
const viewRoles = () => {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }
  });
  return roles;
};

// view all managers for addEmployee function
const viewManagers = () => {
  connection.query(
    'SELECT first_name, last_name FROM employee WHERE (manager_id != "1") OR (manager_id IS NULL)',
    (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managers.push(res[i]);
      }
    }
  );
  return managers;
};

// view all departments for addRole function
const viewDepartments = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      roles.push(res[i].department_name);
    }
  });
  return departments;
};

// view all employees first and last names for updateRole function
const viewEmployeesFL = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name FROM employee",
    (res, err) => {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        flName = `${choice.first_name} ${choice.last_name}`;
        employeesFL.push(flName);
      }
    }
  );
  return employeesFL;
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
        type: "list",
        name: "manager",
        message: "What is the employee's manager's name?",
        choices: viewManagers(),
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?, ?, (SELECT id FROM roles WHERE title = ?), (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(first_name," ", last_name) = > ) AS tmptable))',
        [answer.firstName, answer.lastName, answer.role, answer.manager]
      );
      startPrompt();
    });
};

// add employee role
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the title of this role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is this role's salary?",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does this role fall into?",
        choices: viewDepartments(),
      },
    ])
    .then((answer) => {
      // get department id to assign to the new role
      res.forEach((value) => {
        if (answer.department_name === value.name) {
          deptID = value.id;
        }
      });
      // add role to database
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.roleTitle,
          salary: answer.salary,
          department_id: deptID,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${answer.roleTitle} has been added as a new role!`);
          startPrompt();
        }
      );
    });
};

// add employee department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of this department?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.departmentName,
        },
        (err, res) => {
          if (err) throw err;
          console.log(
            `${answer.departmentName} has been added as a new department!`
          );
          startPrompt();
        }
      );
    });
};

// update employee role
const updateRole = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "empUpdate",
      message: "Select the employee you would like to update.",
      choices: viewEmployeesFL(),
    },
    {
      type: "list",
      name: "roleUpdate",
      message: "Select the new employee's role.",
      choices: viewRoles(),
    },
  ]).then((answer) => {
    
  });
};

// connection ID
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as Id" + connection.threadId);
  startPrompt();
});
