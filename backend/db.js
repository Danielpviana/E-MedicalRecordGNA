const mysql = require('mysql2');
const settings = require('./env.js');
// require('dotenv').config({ path: './backend/.env' });

// dotenv.config();
// console.log('******')
// console.log(settings)

const pool = mysql.createPool({
  host: settings.host,
  user: settings.user,
  password: settings.password,
  database: settings.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();