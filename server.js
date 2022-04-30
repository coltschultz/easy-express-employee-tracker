const cTable = require("console.table");
const { promptUser } = require("./utils/promptUser.js");
const express = require("express");
const db = require("./db/connection.js");

const PORT = process.env.PORT || 3001;
const app = express();

// Get all employees function
const getEmployees = function () {
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
    })
    // Prompt the User
    .then(promptUser)
    .catch(console.log);
};
// End get employees function

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Show all employees when the server starts
    getEmployees();
  });
});