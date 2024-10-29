const inquirer = require('inquirer');


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

function init() {

    inquirer.prompt(questions)


}

init();

