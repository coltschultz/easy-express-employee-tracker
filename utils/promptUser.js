const inquirer = require("inquirer");
const db = require("../db/connection.js");
const cTable = require("console.table");

// Add a Department
const addDepartment = function () {
  inquirer
    .prompt({
      name: "name",
      type: "text",
      message: "What is the name of the department?",
    })
    .then((answers) => {
      db.query(
        `INSERT INTO departments (department) VALUES ('${answers.name}')`,
        function (err, result) {
          if (err) throw err;
          console.log(`Added ${answers.name} to the database.`);
          promptUser();
        }
      );
    });
};

// Add a Role
const addRole = function () {
  inquirer
    .prompt([
      {
        name: "role_title",
        type: "text",
        message: "What is the title of the role?",
      },
      {
        name: "role_salary",
        type: "text",
        message: "What is the salary for the role?",
      },
      {
        name: "department",
        type: "list",
        message: "What department does the role fall under?",
        choices: departmentChoices,
      },
    ])
    .then((answers) => {
      db.promise()
        .query(
          `SELECT id FROM departments WHERE department = '${parseInt(
            answers.department
          )}'`
        )
        .then(([rows, fields]) => {
          roleDepartmentId = parseInt(rows.map((a) => a.id));
          roleSalary = parseInt(answers.role_salary);
          roleTitle = answers.role_title;

          db.query(
            `INSERT INTO roles (title, salary, department_id) 
            VALUES ('${roleTitle}','${roleSalary}','${roleDepartmentId}')`,
            function (err, result) {
              if (err) throw err;
              console.log(`Added ${roleTitle} to the database.`);
              promptUser();
            }
          );
        });
    });
};

// Add an Employee
const addEmployee = function () {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "text",
        message: "What is the first name of the employee?",
      },
      {
        name: "last_name",
        type: "text",
        message: "What is the last name of the employee?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employees role?",
        choices: roleChoices,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employees manager?",
        choices: employeeChoices,
      },
    ])
    .then((answers) => {
      db.promise()
        .query(`SELECT id FROM roles WHERE id = '${parseInt(answers.role)}'`)
        .then(([rows, fields]) => {
          empRole = parseInt(rows.map((a) => a.id));
          empFirst = answers.first_name;
          empLast = answers.last_name;
          empManager = parseInt(answers.manager);

          db.query(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
            VALUES ('${empFirst}','${empLast}','${empRole}','${empManager}')`,
            function (err, result) {
              if (err) throw err;
              console.log(`Added ${empFirst} ${empLast} to the database.`);
              promptUser();
            }
          );
        });
    });
};

// Delete A Department
const deleteDepartment = function () {
  inquirer
    .prompt([
      {
        name: "department",
        type: "list",
        message: "Which department would you like to delete?",
        choices: departmentChoices,
      },
    ])
    .then((answers) => {
      db.promise()
        .query(
          `SELECT id FROM departments WHERE id = '${parseInt(
            answers.department
          )}'`
        )
        .then(([rows, fields]) => {
          Id = parseInt(rows.map((a) => a.id));

          db.query(
            `DELETE FROM departments 
              WHERE id = ${Id}`,
            function (err, result) {
              if (err) throw err;
              console.log(`Deleted ${answers.department} from the database.`);
              promptUser();
            }
          );
        });
    });
};

// Delete A Role
const deleteRole = function () {
  inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Which role would you like to delete?",
        choices: roleChoices,
      },
    ])
    .then((answers) => {
      db.promise()
        .query(`SELECT id FROM roles WHERE id = '${parseInt(answers.role)}'`)
        .then(([rows, fields]) => {
          Id = parseInt(rows.map((a) => a.id));

          db.query(
            `DELETE FROM roles 
              WHERE id = ${Id}`,
            function (err, result) {
              if (err) throw err;
              console.log(`Deleted ${answers.role} from the database.`);
              promptUser();
            }
          );
        });
    });
};

// Delete An Employee
const deleteEmployee = function () {
  inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Which employee would you like to delete?",
        choices: employeeChoices,
      },
    ])
    .then((answers) => {
      db.promise()
        .query(
          `SELECT id FROM employees WHERE id = '${parseInt(answers.role)}'`
        )
        .then(([rows, fields]) => {
          Id = parseInt(rows.map((a) => a.id));

          db.query(
            `DELETE FROM employees 
              WHERE id = ${Id}`,
            function (err, result) {
              if (err) throw err;
              console.log(`Deleted ${answers.role} from the database`);
              promptUser();
            }
          );
        });
    });
};

// Update a Department
const updateDepartment = function () {
  inquirer
    .prompt([
      {
        name: "oldName",
        type: "list",
        message: "What is the name of the department you wish to update?",
        choices: departmentChoices,
      },
      {
        name: "newName",
        type: "text",
        message: "What is the new name for the department?",
      },
    ])
    .then((answers) => {
      db.query(
        `UPDATE departments 
          SET department = '${answers.newName}'
          WHERE id = ${parseInt(answers.oldName)}`,
        function (err, result) {
          if (err) throw err;
          console.log(`Updated ${answers.oldName} to ${answers.newName} in the database.`);
          promptUser();
        }
      );
    });
};

// Update a Role
const updateRole = function () {
  inquirer
    .prompt([
      {
        name: "oldRole",
        type: "list",
        message: "Which role would you like to update?",
        choices: roleChoices,
      },
      {
        name: "newTitle",
        type: "text",
        message: "What is the new title of the role?",
      },
      {
        name: "newSalary",
        type: "text",
        message: "What is the new salary for the role?",
      },
      {
        name: "newDepartment",
        type: "list",
        message: "What department does the role now fall under?",
        choices: departmentChoices,
      },
    ])
    .then((answers) => {
      db.query(
        `UPDATE roles 
            SET title = '${answers.newTitle}', salary = ${parseInt(
          answers.newSalary
        )}, department_id = ${parseInt(answers.newDepartment)}
            WHERE id = ${parseInt(answers.oldRole)}`,
        function (err, result) {
          if (err) throw err;
          console.log(`Updated ${answers.oldRole} to ${answers.newTitle} in the database.`);
          promptUser();
        }
      );
    });
};

// Update an Employee Role
const updateEmployee = function () {
  inquirer
    .prompt([
      {
        name: "oldEmployee",
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: employeeChoices,
      },
      {
        name: "new_role",
        type: "list",
        message: "What is the employees role?",
        choices: roleChoices,
      },
    ])
    .then((answers) => {
      db.query(
        `UPDATE employees 
          SET role_id = '${parseInt(answers.new_role)}'
            WHERE id = ${parseInt(answers.oldEmployee)}`,
        function (err, result) {
          if (err) throw err;
          console.log(`Updated ${answers.oldEmployee} to ${answers.newName} in the database.`);
          promptUser();
        }
      );
    });
};

// Update an Employee Manager
const updateManager = function () {
    inquirer
      .prompt([
        {
          name: "Employee",
          type: "list",
          message: "Which employee's manager would you like to update?",
          choices: employeeChoices,
        },
        {
            name: "newManager",
            type: "list",
            message: "Who is the employees new manager?",
            choices: employeeChoices,
        },
      ])
      .then((answers) => {
        db.query(
          `UPDATE employees 
            SET manager_id = '${parseInt(answers.newManager)}'
              WHERE id = ${parseInt(answers.Employee)}`,
          function (err, result) {
            if (err) throw err;
            console.log(`Updated ${answers.Employee}'s manager to ${answers.newManager} in the database.`);
            promptUser();
          }
        );
      });
  };

// View All Departments
const viewDepartments = function () {
  db.promise()
    .query(
      `
    SELECT * FROM departments;`
    )
    .then(([rows, fields]) => {
      console.table(rows);
      promptUser();
    });
};

// View All Roles
const viewRoles = function () {
  db.promise()
    .query(
      `
    SELECT * FROM roles;`
    )
    .then(([rows, fields]) => {
      console.table(rows);
      promptUser();
    });
};

// View All Employees
const viewEmployees = function () {
  console.log("testingtesting123");
  db.promise()
    .query(
      `
    SELECT 
    employees.id,
        employees.first_name,
        employees.last_name,
        roles.title,
        departments.department,
        roles.salary,
        manager.first_name as manager
    FROM Employees employees
    LEFT OUTER JOIN Employees manager
    ON employees.manager_id = manager.Id
    LEFT OUTER JOIN roles
    ON employees.role_id = roles.id
    LEFT OUTER JOIN departments 
    ON roles.department_id = departments.id;
    `
    )
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

// Make Sure The Lists Are Ready to Populate
const getStuff = function () {
  getRoles();
  getEmployees();
  getDepartments();
};

// Main Menu
const promptUser = function () {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "Add Department",
        "Delete Department",
        "View All Roles",
        "Add Role",
        "Delete Role",
        "View All Employees",
        "Add Employee",
        "Delete Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    })
    .then(getStuff())
    .then((answers2) => {
      if (answers2.choice === "Add Department") {
        addDepartment();
      } else if (answers2.choice === "Add Employee") {
        addEmployee();
      } else if (answers2.choice === "Add Role") {
        addRole();
      } else if (answers2.choice === "Delete Department") {
        deleteDepartment();
      } else if (answers2.choice === "Delete Role") {
        deleteRole();
      } else if (answers2.choice === "Delete Employee") {
        deleteEmployee();
      } else if (answers2.choice === "Update Department") {
        updateDepartment();
      } else if (answers2.choice === "Update Role") {
        updateRole();
      } else if (answers2.choice === "Update Employee Role") {
        updateEmployee();
      } else if (answers2.choice === "Update Employee Manager") {
        updateManager();
      } else if (answers2.choice === "View All Departments") {
        viewDepartments();
      } else if (answers2.choice === "View All Roles") {
        viewRoles();
      } else if (answers2.choice === "View All Employees") {
        viewEmployees();
      }
    })
    .catch((err) => console.log(err));
};

var roleChoices = [];
var employeeChoices = [];

const getRoles = function () {
  db.promise()
    .query(`SELECT id, title FROM roles`)
    .then(([rows, fields]) => {
      roleChoices = rows.map((a) => a.id + " - " + a.title);
    });
};

const getEmployees = function () {
  db.promise()
    .query(`SELECT id, first_name, last_name FROM employees`)
    .then(([rows, fields]) => {
      employeeChoices = rows.map(
        (a) => a.id + " - " + a.first_name + " " + a.last_name
      );
    });
};

const getDepartments = function () {
  db.promise()
    .query(`SELECT id, department FROM departments`)
    .then(([rows, fields]) => {
      departmentChoices = rows.map((a) => a.id + " - " + a.department);
    });
};

module.exports = { promptUser, getRoles, getEmployees };
