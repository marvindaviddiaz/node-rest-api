const mysql = require('mysql2');

const pool = mysql.createPool({
   host: process.env.DB_HOST || 'localhost',
   user: process.env.DB_USER || 'root',
   database: process.env.DB_NAME || 'SANDBOX',
   password: process.env.DB_PASSW || 'root'
});

module.exports = pool.promise();
