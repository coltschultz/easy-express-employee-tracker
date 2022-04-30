const mysql = require('mysql2');
const db = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  user: 'root',
  password: 'NewPassword',
  database: 'employees'
});

module.exports = db;