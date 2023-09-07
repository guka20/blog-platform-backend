const mysql = require("mysql2");
const dotenv = require('dotenv')
dotenv.config();
const connect = mysql.createPool({
    host:process.env.DBHOST,
    database:process.env.DBNAME,
    port:process.env.DBPOST,
    user:process.env.DBUSER,
    password:process.env.DBPASSWORD
})

module.exports = connect