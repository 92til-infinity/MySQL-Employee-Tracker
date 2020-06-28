const inquirer = require("inquirer");
const connection = require("./lib/connection.js");
const Department = require("./lib/Department");
const Role = require("./lib/Role");
const Employee = require("./lib/Employee");
const Table = require("console.table");

const newDepot = new Department();
const newRole = new Role();
const newEmployee = new Employee();

function init() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            // "View All Employees by Manager",
            "Add Employee",
            "Remove Employee",
            "Add Department",
            "Remove Department",
            "Add Role",
            "Remove Role",
            "Update Employee Role",
            "Update Employee Manager",
            "Quit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View All Employees":
                viewAllEmployee();
                break;

            case "View All Departments":
                viewAllDepartment();
                break;

            case "View All Employees Roles":
                viewAllRole();
                break;

            // case "View All Employees by Manager":
            //     viewEmployeeManager();
            //     break;

            case "Add Employee":
                addEmployee();
                break;

            // case "Remove Employee":
            //     deleteEmployee();
            //     break;

            case "Add Department":
                addDepartment();
                break;

            // case "Remove Department":
            //     deleteDepartment();
            //     break;

            case "Add Role":
                addRole();
                break;

            // case "Remove Role":
            //     deleteRole();
            //     break;

            case "Update Role":
                updateRole();
                break;

            // case "Update Manager":
            //     updateManager();
            //     break;

            case "Quit":
                connection.end();
        }
    });

}


// view all functions
function viewAllEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const table = Table.getTable(res);
        console.log(table);
    })
};
function viewAllDepartment() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const table = Table.getTable(res);
        console.log(table);
    })
};
function viewAllRole() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        const table = Table.getTable(res);
        console.log(table);
    })
};

// update functions
function updateRole() {
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
                    console.table(empChoice);
                    return empChoice;
                },
                message: "Please select an employee to update"
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

// updating manager after i get it working.
//---).then(function (err) {
//     if (err) throw err;
//     inquirer.prompt({
//         name: "manager_id",
//         type: "input",
//         message: "What is their new managers ID number.",
//     }).then(function (answer) {
//         connection.query(
//             "UPDATE employee SET ? WHERE ?",
//             {
//                 manager_id: answer.manager_id
//             },

//             function (err) {
//                 if (err) throw err;
//                 init();
//             });
//     });
// });


// Adding functions
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "new_role",
            message: "What type of role would you like to add?"
        },
        {
            type: "input",
            name: "new_salary",
            message: "What's the salary be for the new role?(ex:50000)"
        },
        {
            type: "input",
            name: "new_deptID",
            message: "What is the department ID for the new role?(`##` format)"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO role SET ?",
            {
                title: answer.new_role,
                salary: answer.new_salary,
                department_id: answer.new_deptID
            },
            function (err) {
                if (err) throw err;
                console.log("New role was added successfully!");
                init();
            });
    });

}

function addEmployee() {
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
            message: "What is the employee's manager's ID number. if no manager please enter 'N/A'.",
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
                            inquirer.prompt({
                                name: "department_id",
                                type: "input",
                                message: "What is their department ID number.",
                            }).then(function (answer) {
                                connection.query(
                                    "INSERT INTO department SET ?",
                                    {
                                        department_id: answer.department_id
                                    },

                                    function (err) {
                                        if (err) throw err;
                                        init();
                                    });
                            });
                        });
                });

            }
        );
    });

}

function addDepartment() {
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

