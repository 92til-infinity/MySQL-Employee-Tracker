INSERT INTO department
    (name)
VALUES
    ("Operations"),
    ("Accounting"),
    ("Loss Prevention"),
    ("Human Resources");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Operations Manager", 90000, 1),
    ("Controller", 70000, 2),
    ("Risk Manager", 50000, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Scott", "Glover", 1, 1),
    ("Ronald", "McDonald", 1, 1),
    ("Vanessa", "Glover", 1, 1);

SELECT *
FROM department;
SELECT *
FROM role;
SELECT *
FROM employee;