// Next steps... add route for adding an employee. test post routes.

const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'NewPassword',
  database: 'employees'
});

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
    // const errors = inputCheck(
    //   body,
    //   'name'
    // );
    // if (errors) {
    //   res.status(400).json({ error: errors });
    //   return;
    // }
  
    const sql = `INSERT INTO departments (name)
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
    // const errors = inputCheck(
    //   body,
    //   'job_title',
    //   'salary',
    //   'department'
    // );
    // if (errors) {
    //   res.status(400).json({ error: errors });
    //   return;
    // }
  
    const sql = `INSERT INTO roles (job_title, salary, dept_id)
      VALUES (?,?,?)`;
    const params = [body.job_title, body.salary, body.dept_id];
  
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
  


// Catch All
app.use((req, res) => {
    res.status(404).end();
  });

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });


