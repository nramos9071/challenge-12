INSERT INTO departments (id, department_name, department_id) 
VALUES (1, 'Sales', 1),
       (2, 'Information Technology', 2),
       (3, 'Finance', 3),
       (4, 'Legal', 4),
       (5, 'Service', 5),
       (6, 'Human Resources', 6),
       (7, 'Marketing', 7);


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

INSERT INTO employees (id, first_name, last_name, title, salary, role_id, manager_id)
VALUES (1 , 'Nick', 'Ramos', 'IT Manager', 95000, 3, 1),
       (2 , 'Corina', 'Soto', 'Sales Manager', 100000, 1, 2),
       (3 , 'Jeffery', 'Riley', 'Sales Associate', 50000, 2, 2),
       (4 , 'Jose', 'Villescaz', 'Finance Manager', 90000, 5, 3),
       (5 , 'Jordan', 'Tellez', 'Finance Associate', 50000, 6, 3),
       (6 , 'Cristina', 'Hunter', 'Legal Manager', 95000, 7, 4),
       (7 , 'Sunny', 'Hernandez', 'Legal Associate', 50000, 8, 4),
       (8 , 'Matthew', 'Campos', 'Service Manager', 90000, 9, 5),
       (9 , 'Louis', 'Munoz', 'Service Associate', 50000, 10, 5),
       (10, 'Daniel', 'Barajas', 'HR Manager', 95000, 11, 6),
       (11, 'Lucia', 'Hernandez', 'HR Associate', 50000, 12, 6),
       (12, 'Raquel', 'Munoz', 'Marketing Manager', 95000, 13, 7),
       (13, 'Natalie', 'Tellez', 'Marketing Associate', 50000, 14, 7);
