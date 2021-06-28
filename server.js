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

// arrays for use throughout
let roles = [];
let managers = [];
let departments = [];

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
      // go to appropriate function based on prompt selection
      switch (answer.choice) {
        case "View all employees":
          viewAllEmployees();
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

// function to view employees
const viewAllEmployees = () => {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.id, department.department_name AS "department", employee.manager_id FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};

// function to view roles
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

// function to view departments
const viewEmpDepartments = () => {
  connection.query(
    "SELECT department.department_name AS department, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
};

// function to view all roles for addEmployee and updateRole functions
const viewRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }
  });
  return roles;
};

// function to view all managers for addEmployee function
const viewManagers = () => {
  connection.query(
    'SELECT first_name, last_name, id FROM employee WHERE (manager_id != "1") OR (manager_id IS NULL)',
    (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managers.push(res[i].id);
      }
    }
  );
  return managers;
};

// function to add employee
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
        message: "What is the employee's role ID?",
        choices: viewRoles(),
      },
      {
        type: "list",
        name: "manager",
        message: "What is the employee's manager's ID?",
        choices: viewManagers(),
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)",
        [answer.firstName, answer.lastName, answer.role, answer.manager]
      );
      console.log(
        `${answer.firstName} ${answer.lastName} has been added as a new employee!`
      );
      startPrompt();
    });
};

// function to add employee role
const addRole = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
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
          // embedded function to view all departments
          choices() {
            let deptsArr = [];
            res.forEach(({ id, department_name }) => {
              deptsArr.push({ name: department_name, value: id });
            });
            return deptsArr;
          },
        },
      ])
      .then((answer) => {
        res.forEach((value) => {
          if (answer.department_name === value.name) {
            deptId = value.id;
          }
        });
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.roleTitle,
            salary: answer.salary,
            department_id: deptId,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${answer.roleTitle} has been added as a new role.`);
            viewRoles();
            startPrompt();
          }
        );
      });
  });
};

// function to add employee department
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

// function to update employee role
const updateRole = () => {
  connection.query("SELECT * from employee", (err, res) => {
    connection.query("SELECT * from role", (err, res2) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "empUpdate",
            message: "Select the employee you would like to update.",
            // embedded function to show list of names for selection
            choices() {
              let employeesArr = [];
              res.forEach(({ id, first_name, last_name }) => {
                employeesArr.push({
                  name: `${first_name} ${last_name}`,
                  value: id,
                });
              });
              return employeesArr;
            },
          },
          {
            type: "list",
            name: "roleUpdate",
            message: "Select the employee you would like to update.",
            // embedded function to show list of roles for selection
            choices() {
              let rolesArr = [];
              res2.forEach(({ id, title }) => {
                rolesArr.push({ name: title, value: id });
              });
              return rolesArr;
            },
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: answer.roleUpdate,
              },
              {
                id: answer.empUpdate,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log("This employee's role has been updated.");
            }
          );
          viewEmpRoles();
          startPrompt();
        });
    });
  });
};

// connection ID
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as Id" + connection.threadId);
  startPrompt();
});
