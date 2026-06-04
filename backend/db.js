const mysql = require('mysql2'); //Imports the mysql2 library
require('dotenv').config(); //Reads your .env file 

const db = mysql.createConnection({
    host: process.env.DB_HOST, //// localhost
    user: process.env.DB_USER,     //// root
    password: process.env.DB_PASSWORD, //// empty password 
    database: process.env.DB_NAME, //// flashcards_db
});

db.connect((err) => {
    if (err) {
        console.error('❌ DB connection failed:', err);
    } else {
        console.log('✅ MySQL connected!');
    }
});

module.exports = db;