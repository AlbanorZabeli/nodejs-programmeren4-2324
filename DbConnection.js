
const mysql = require('mysql2')
require('dotenv').config()
 
 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD
})
 
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err)
    return
  }
  console.log(`Connected to database.`)
})
 
module.exports = connection
 