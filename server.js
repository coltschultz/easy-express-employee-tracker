const cTable = require('console.table');
const { promptUser } = require('./utils/promptUser.js');
const express = require('express');
const db = require('./db/connection.js');


const PORT = process.env.PORT || 3001;
const app = express();



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




// GET all departments
app.get('/api/departments', (req, res) => {
const sql = `SELECT * FROM departments`;

db.query(sql, (err, rows) => {
    if (err) {
    res.status(500).json({ error: err.message });
    return;
    }
    res.json({
    message: 'success',
    data: rows
    });
});
});

// GET all Employees
app.get('/api/employees', (req, res) => {
  const sql = `SELECT * FROM employees`;
  
  db.query(sql, (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
      return;
      }
      res.json({
      message: 'success',
      data: rows
      });
  });
  });

// GET all Roles
app.get('/api/roles', (req, res) => {
  const sql = `SELECT * FROM roles`;
  
  db.query(sql, (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
      return;
      }
      res.json({
      message: 'success',
      data: rows
      });
  });
  });

// GET Department by ID
app.get('/api/department/:id', (req, res) => {
    const sql = `SELECT * FROM departments WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });


// GET role by id
app.get('/api/role/:id', (req, res) => {
    const sql = `SELECT * FROM roles WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });

// Create a department
app.post('/api/department', ({ body }, res) => {
  
    const sql = `INSERT INTO departments (department)
      VALUES (?)`;
    const params = [body.name];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });

// Create a role
app.post('/api/role', ({ body }, res) => {
  
    const sql = `INSERT INTO roles (title, salary, department_id)
      VALUES (?,?,?)`;
    const params = [body.title, body.salary, body.department_id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });
  
// Create an Employee
app.post('/api/employee', ({ body }, res) => {

  const sql = `INSERT INTO employees (first_name, last_name, role_id)
  VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Delete a department
app.delete('/api/department/:id', (req, res) => {
  const sql = `DELETE FROM departments WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Department not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Delete a role
app.delete('/api/role/:id', (req, res) => {
  const sql = `DELETE FROM roles WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Delete an employee
app.delete('/api/employee/:id', (req, res) => {
  const sql = `DELETE FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Update an employees role
app.put('/api/employee/:id', (req, res) => {

  const sql = `UPDATE employees SET role_id = ? 
               WHERE id = ?`;
  const params = [req.body.role_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Catch All
app.use((req, res) => {
    res.status(404).end();
  });



// GET all Employees function
// let tableData;
// SELECT employees.first_name, employees.last_name, roles.title, employees.manager_id
// AS role
// FROM  employees
// LEFT JOIN roles
// ON employees.role_id = roles.id ;



const getEmployees = function() {
  db.promise().query(`
  SELECT 
  employees.id,
      employees.first_name as first name,
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
  `)
  .then( ([rows,fields]) => {
    console.table(rows);
  })
  // Prompt the User
  .then(promptUser)
  .catch(console.log)
  // .then( () => db.end());
  };
// The bracket above closes the getEmployees function


// Start server after DB connection

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      getEmployees();
      
    });
  });


  

// Begin Inquirer Code
