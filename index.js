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

function init() {
    inquirer.prompt(questions).then((answers) => {
        switch (answers.home) {
            case 'view all departments':
                viewDepartments();
                break;
            // Add cases for other choices here
            default:
                console.log(`Invalid action: ${answers.home}`);
                init();
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

