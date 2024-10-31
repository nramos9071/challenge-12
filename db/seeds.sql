-- Insert departments
INSERT INTO department (id, name)
VALUES (1, 'Sales'),
       (2, 'IT'),
       (3, 'Finance'),
       (4, 'Legal'),
       (5, 'Service'),
       (6, 'Human Resources'),
       (7, 'Marketing');

-- Insert roles
INSERT INTO roles (id, title, salary, department_id)
VALUES (1, 'Sales Manager', 100000, 1),
       (2, 'Sales Associate', 50000, 1),
       (3, 'IT Manager', 95000, 2),
       (4, 'IT Associate', 50000, 2),
       (5, 'Finance Manager', 90000, 3),
       (6, 'Finance Associate', 50000, 3),
       (7, 'Legal Manager', 95000, 4),
       (8, 'Legal Associate', 50000, 4),
       (9, 'Service Manager', 90000, 5),
       (10, 'Service Associate', 50000, 5),
       (11, 'HR Manager', 95000, 6),
       (12, 'HR Associate', 50000, 6),
       (13, 'Marketing Manager', 95000, 7),
       (14, 'Marketing Associate', 50000, 7);

-- Insert employees
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1 , 'Nick', 'Ramos', 3, NULL),
       (2 , 'Corina', 'Soto', 1, NULL),
       (3 , 'Jeffery', 'Riley', 2, 2),
       (4 , 'Jose', 'Villescaz', 5, NULL),
       (5 , 'Jordan', 'Tellez', 6, 4),
       (6 , 'Cristina', 'Hunter', 7, NULL),
       (7 , 'Sunny', 'Hernandez', 8, 6),
       (8 , 'Matthew', 'Campos', 9, NULL),
       (9 , 'Louis', 'Munoz', 10, 8),
       (10, 'Daniel', 'Barajas', 11, NULL),
       (11, 'Lucia', 'Hernandez', 12, 10);
