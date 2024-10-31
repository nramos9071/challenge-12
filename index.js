const inquirer = require('inquirer');
const { Sequelize, DataTypes } = require('sequelize');
const consoleTable = require('console.table');
require('dotenv').config();

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

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
Employee.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });


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
            console.table(roles.map(role => role.toJSON()));
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
                { model: Employee, as: 'manager' }
            ]
        });
        if (employees.length === 0) {
            console.log('No employees found.');
        } else {
            console.table(employees.map(emp => emp.toJSON()));
        }
        init(); // Call init again to prompt the user for the next action
    } catch (err) {
        console.error('Error fetching employees:', err);
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

