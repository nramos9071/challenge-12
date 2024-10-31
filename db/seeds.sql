-- Insert departments
INSERT INTO department (name)
VALUES ('Sales'),
       ('IT'),
       ('Finance'),
       ('Legal'),
       ('Service'),
       ('Human Resources'),
       ('Marketing'),
       ('Executive');

-- Insert roles
INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Manager', 100000, 1),
       ('Sales Associate', 50000, 1),
       ('IT Manager', 95000, 2),
       ('IT Associate', 50000, 2),
       ('Finance Manager', 90000, 3),
       ('Finance Associate', 50000, 3),
       ('Legal Manager', 95000, 4),
       ('Legal Associate', 50000, 4),
       ('Service Manager', 90000, 5),
       ('Service Associate', 50000, 5),
       ('HR Manager', 95000, 6),
       ('HR Associate', 50000, 6),
       ('Marketing Manager', 95000, 7),
       ('Marketing Associate', 50000, 7);



-- Insert employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Nick', 'Ramos', 2, 1),
       ('Corina', 'Soto', 2, 1),
       ('Jeffery', 'Riley', 2, 1),
       ('Jose', 'Villescaz', 6, 3),
       ('Jordan', 'Tellez', 6, 3),
       ('Cristina', 'Hunter', 6, 3),
       ('Sunny', 'Hernandez', 6, 3),
       ('Matthew', 'Campos', 10, 5),
       ('Louis', 'Munoz', 10, 5),
       ('Daniel', 'Barajas', 12, 7),
       ('Lucia', 'Hernandez', 12, 7);

INSERT INTO manager (first_name, last_name, department_id)
VALUES ('Albert', 'Ramos', 1),
       ('Carmen', 'Garcia', 2),
       ('Diana', 'Gomez', 3),
       ('Cynthia', 'Munoz', 4),
       ('Victoria', 'Whelan', 5),
       ('Juan', 'Soto', 6),
       ('Inez', 'Martinez', 7);