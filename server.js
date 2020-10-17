const inquirer = require("inquirer");

const logo = require("asciiart-logo");
const Table = require("console.table");
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: `root`,
    database: `employee_db`
});

// Connect / begin
init();
connection.connect((err) => {
    if (err) throw err;

});
connection.query = util.promisify(connection.query);


function init() {
    const logoText = logo({ name: "Employee Manager" }).render();

    console.log(logoText);

    questionLoader();
}

async function questionLoader() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            {
                name: "View All Employees",
                values: "View_All_Employees"
            },
            {
                name: "View All Departments",
                values: "View_All_Departments"
            },
            {
                name: "View All Roles",
                values: "View_All_Roles"
            },
            {
                name: "Add Employee",
                values: "Add_Employee"
            },
            {
                name: "Add Department",
                values: "Add_Department"
            },
            {
                name: "Add Role",
                values: "Add_Role"
            },
            {
                name: "Update Role",
                values: "Update_Role"
            },
            {
                name: "Remove Role",
                values: "Remove_Role"
            },
            {
                name: "Delete Employee",
                values: "Delete_Employee"
            },
            {
                name: "Quit",
                value: "Quit"
            }
        ]
    })
    // calls function depending on your above choice

    switch (answer.action) {
        case "View_All_Employees":
            viewAllEmployee();
            break;

        case "View_All_Departments":
            viewAllDepartment();
            break;

        case "View_All_Roles":
            viewAllRole();
            break;

        case "Add_Employee":
            addEmployee();
            break;

        case "Add_Department":
            addDepartment();
            break;

        case "Add_Role":
            addRole();
            break;

        case "Update_Role":
            updateRole();
            break;
        case "Remove_Role":
            updateRole();
            break;
        case "Delete_Employee":
            deleteEmployee();
            break;

        case "Quit":
            connection.end();
    }
}

// view all functions
async function viewAllEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        init();
    })
};
async function viewAllDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        init();
    })
};
async function viewAllRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        init();
    })
};

// update functions
async function updateRole() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    var empChoice = [];
                    for (var i = 0; i < results.length; i++) {
                        console.table(results[i]);
                        empChoice.push(results[i].first_name);
                    }
                    return empChoice;
                },
                message: "Please select an employee"
            }
        ]).then(function (answer) {
            var chosenName;
            for (var i = 0; i < results.length; i++) {
                if (results[i].first_name === answer.choice) {
                    chosenName = results[i];
                }
                console.log(chosenName.title);
                connection.query(
                    "UPDATE role SET ? WHERE ?",
                    [
                        {
                            title: answer.title
                        },
                        {
                            id: chosenName.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        init();
                    });
            }
        });

    });
}

// Adding functions
async function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "newRole",
            message: "What role would you like to add?"
        },
        {
            type: "input",
            name: "newSalary",
            message: "What's the salary (ex:50000)"
        },
        {
            type: "input",
            name: "newDept",
            message: "What is the department ID (`##` format)"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO role SET ?",
            {
                title: answer.newRole,
                salary: answer.newSalary,
                department_id: answer.newDept
            },
            function (err) {
                if (err) throw err;
                console.log("New role was added successfully!");
                init();
            });
    });

}

async function addEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name."
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name."
        },
        {
            name: "role_id",
            type: "input",
            message: "What is the employee's role ID."
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager's ID number. if no manager please enter '0'.",
            default: null
        }
    ]).then(function (answers) {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: answers.role_id,
                manager_id: answers.manager_id || null
            },

            function (err) {
                if (err) throw err;
                inquirer.prompt([
                    {
                        name: "title",
                        type: "input",
                        message: "What is the employee's title."
                    },
                    {
                        name: "salary",
                        type: "input",
                        message: "What is the employee's salary."
                    }
                ]).then(function (answers) {
                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                            title: answers.title,
                            salary: answers.salary
                        },

                        function (err) {
                            if (err) throw err;
                            init();
                        }
                    )

                });
            }
        )
    });
}


async function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "new_department",
        message: "What is the new department name."
    }).then(function (answer) {
        connection.query("INSERT INTO department SET ?",
            {
                name: answer.new_department
            },
            function (err) {
                if (err) throw err;
                console.log("New department was added successfully!")
                init();
            });
    });
}


// removing function

async function deleteEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    var empChoice = [];
                    for (var i = 0; i < results.length; i++) {
                        console.table(results[i]);
                        empChoice.push(results[i].first_name);
                    }
                    return empChoice;
                },
                message: "Please select an employee"
            }
        ]).then(function (answer) {
            var chosenName;
            for (var i = 0; i < results.length; i++) {
                if (results[i].first_name === answer.choice) {
                    chosenName = results[i];
                }
                console.log(chosenName.first_name);
                connection.query(
                    "DELETE FROM employee WHERE id = ?",
                    [
                        {
                            name: answer.first_name
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        init();
                    });
            }
        });

    });
}