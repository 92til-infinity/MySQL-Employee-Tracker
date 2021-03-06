DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE department
(
  id INT NOT NULL
  AUTO_INCREMENT,
  name VARCHAR
  (30) NOT NULL,
  PRIMARY KEY
  (id)
);

  CREATE TABLE role (
  id INT NOT NULLY AUTO_INCREMENT,
  title VARCHAR
  (30) NOT NULL,
  salary DECIMAL
  (10,4) NOT NULL,
  department_id INT DEFAULT 0,
  PRIMARY KEY
  (id)
);

  CREATE TABLE employee
  (
    id INT NOT NULL
    AUTO_INCREMENT,
  first_name VARCHAR
    (30) NOT NULL,
  last_name VARCHAR
    (30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY
    (id)
);

    SELECT *
    FROM department;

    SELECT *
    FROM role;

    SELECT *
    FROM employee;