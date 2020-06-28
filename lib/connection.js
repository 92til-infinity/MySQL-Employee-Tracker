const mysql = require("mysql");
const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: `root`,
    database: `employee_db`
});
// Connect / begin
connection.connect((err) => {
    if (err) throw err;
    init();
});
module.exports = connection;