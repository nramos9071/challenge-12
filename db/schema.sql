DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;

\c departments_db;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
    department_id INTEGER NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NOT NULL
);  