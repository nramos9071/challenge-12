const inquirer = require('inquirer');
const { Sequelize, DataTypes } = require('sequelize');
const consoleTable = require('console.table');
require('dotenv').config();



const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});

const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'department',
    timestamps: false
});

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    department_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Department,
            key: 'id'
        }
    }
}, {
    tableName: 'roles',
    timestamps: false
});

const Manager = sequelize.define('Manager', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Department,
            key: 'id'
        }
    }
}, {
    tableName: 'manager',
    timestamps: false
});

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'employees',
    timestamps: false
});

Role.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Employee.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Employee.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });
Manager.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });


const questions = [

    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'home',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role',
            'exit',
        ],
    }



]

async function viewDepartments() {

    try {
        const departments = await Department.findAll();
        console.table(departments.map(dept => dept.toJSON()));
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error(err);
    }
}


async function viewRoles() {
    try {
        console.log('Fetching roles...');
        const roles = await Role.findAll({
            include: [
                { model: Department, as: 'department' }
            ]
        });

        if (roles.length === 0) {
            console.log('No roles found.');
        } else {
            const roleData = roles.map(role => {
                const roleObj = role.toJSON();
                return {
                    ...roleObj,
                    department: roleObj.department ? roleObj.department.name : 'N/A'
                };
            });
            console.table(roleData);
        }
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error fetching roles:', err);
    }
}

async function viewEmployees() {
    try {
        console.log('Fetching employees...');
        const employees = await Employee.findAll({
            include: [
                { model: Role, as: 'role' },
                { model: Manager, as: 'manager' }
            ]
        });

        if (employees.length === 0) {
            console.log('No employees found.');
        } else {
            const employeeData = employees.map(emp => {
                const employee = emp.toJSON();
                return {
                    ...employee,
                    role: employee.role ? employee.role.title : 'N/A',
                    manager: employee.manager ? `${employee.manager.first_name} ${employee.manager.last_name}` : 'N/A'
                };
            });
            console.table(employeeData);
        }
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error fetching employees:', err);
    }
}

async function addDepartment() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: "Enter the department name (or type 'cancel' to go back):",
                validate: input => input ? true : 'Department name cannot be empty'
            }
        ]);

        if (answers.name.toLowerCase() === 'cancel') {
            console.log('Operation cancelled.');
            return init(); // Call init to go back to the main menu
        }

        await Department.create({
            name: answers.name
        });

        console.log('Department added successfully.');
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error adding department:', err);
    }
}

async function addRole() {
    try {
        // Fetch departments for the prompt
        const departments = await Department.findAll();

        const departmentChoices = departments.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        const titleAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "Enter the role title (or type 'cancel' to go back):",
                validate: input => input ? true : 'Role title cannot be empty'
            }
        ]);

        if (titleAnswer.title.toLowerCase() === 'cancel') {
            console.log('Operation cancelled.');
            return init(); // Call init to go back to the main menu
        }

        const salaryAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'salary',
                message: "Enter the role salary (or type 'cancel' to go back):",
                validate: input => !isNaN(input) && input > 0 ? true : 'Salary must be a positive number'
            }
        ]);

        if (salaryAnswer.salary.toLowerCase() === 'cancel') {
            console.log('Operation cancelled.');
            return init(); // Call init to go back to the main menu
        }

        const departmentAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: "Select the department for this role:",
                choices: departmentChoices
            }
        ]);

        await Role.create({
            title: titleAnswer.title,
            salary: parseFloat(salaryAnswer.salary),
            department_id: departmentAnswer.department_id
        });

        console.log('Role added successfully.');
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error adding role:', err);
    }
}

async function addEmployee() {
    try {
        // Fetch roles and employees for the prompts
        const roles = await Role.findAll();
        const managers = await Manager.findAll();

        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));

        const managerChoices = managers.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));
        managerChoices.unshift({ name: 'None', value: null });

        const firstNameAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the employee's first name (or type 'cancel' to go back):",
                validate: input => input ? true : 'First name cannot be empty'
            }
        ]);

        if (firstNameAnswer.first_name.toLowerCase() === 'cancel') {
            console.log('Operation cancelled.');
            return init(); // Call init to go back to the main menu
        }

        const lastNameAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the employee's last name (or type 'cancel' to go back):",
                validate: input => input ? true : 'Last name cannot be empty'
            }
        ]);

        if (lastNameAnswer.last_name.toLowerCase() === 'cancel') {
            console.log('Operation cancelled.');
            return init(); // Call init to go back to the main menu
        }

        const roleAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'role_id',
                message: "Select the employee's role:",
                choices: roleChoices
            }
        ]);

        const managerAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'manager_id',
                message: "Select the employee's manager:",
                choices: managerChoices
            }
        ]);

        await Employee.create({
            first_name: firstNameAnswer.first_name,
            last_name: lastNameAnswer.last_name,
            role_id: roleAnswer.role_id,
            manager_id: managerAnswer.manager_id
        });

        console.log('Employee added successfully.');
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error adding employee:', err);
    }
}

async function addManager() {
    try {
        // Fetch departments for the prompt
        const departments = await Department.findAll();

        const departmentChoices = departments.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the manager's first name (or type 'cancel' to go back):",
                validate: input => input ? true : 'First name cannot be empty'
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the manager's last name (or type 'cancel' to go back):",
                validate: input => input ? true : 'Last name cannot be empty'
            },
            {
                type: 'list',
                name: 'department_id',
                message: "Select the department for this manager:",
                choices: departmentChoices
            }
        ]);

        if (answers.first_name.toLowerCase() === 'cancel' || answers.last_name.toLowerCase() === 'cancel') {
            console.log('Operation cancelled.');
            return init(); // Call init to go back to the main menu
        }

        await Manager.create({
            first_name: answers.first_name,
            last_name: answers.last_name,
            department_id: answers.department_id
        });

        console.log('Manager added successfully.');
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error adding manager:', err);
    }
}

async function updateEmployee() {
    try {
        // Fetch employees for the prompt
        const employees = await Employee.findAll();
        const employeeChoices = employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        const employeeAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: "Select the employee to update:",
                choices: employeeChoices
            }
        ]);

        const selectedEmployee = await Employee.findByPk(employeeAnswer.employee_id, {
            include: [
                { model: Role, as: 'role' },
                { model: Manager, as: 'manager' }
            ]
        });

        const roleChoices = await Role.findAll().then(roles =>
            roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        );

        const managerChoices = await Manager.findAll().then(employees =>
            employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))
        );
        managerChoices.unshift({ name: 'None', value: null });

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the employee's first name:",
                default: selectedEmployee.first_name,
                validate: input => input ? true : 'First name cannot be empty'
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the employee's last name:",
                default: selectedEmployee.last_name,
                validate: input => input ? true : 'Last name cannot be empty'
            },
            {
                type: 'list',
                name: 'role_id',
                message: "Select the employee's role:",
                choices: roleChoices,
                default: selectedEmployee.role_id
            },
            {
                type: 'list',
                name: 'manager_id',
                message: "Select the employee's manager:",
                choices: managerChoices,
                default: selectedEmployee.manager_id
            }
        ]);

        await Employee.update({
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: answers.role_id,
            manager_id: answers.manager_id
        }, {
            where: {
                id: employeeAnswer.employee_id
            }
        });

        console.log('Employee updated successfully.');
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error updating employee:', err);
    }
}

function init() {
    inquirer.prompt(questions).then((answers) => {
        switch (answers.home) {
            case 'view all departments':
                viewDepartments();
                break;
            case 'view all roles':
                viewRoles();
                break;
            case 'view all employees':
                viewEmployees();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'add a manager':
                addManager();
                break;
            case 'update an employee role':
                updateEmployee();
                break;
           
            
                
            // Add cases for other choices here
            default:
                console.log(`Invalid action: ${answers.home}`);
                init();
                break;
            case 'exit': // Handle the exit option
                console.log('Exiting...');
                process.exit();
                break;
        }
    });
}

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database.');
        return sequelize.sync(); // Ensure models are synced with the database
    })
    .then(() => {
        init();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

