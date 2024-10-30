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

function viewDepartments() {

    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
    })
}

function init() {

    inquirer.prompt(questions)

    if 


}

init();

