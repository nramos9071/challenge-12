const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
});

// Define the Department model
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

// Define the Role model
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
        type: DataTypes.INTEGER,
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



// Define the Employee model
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

// Seed data
const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync the models
        await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables

        // Read the SQL file
        const seedSQL = fs.readFileSync(path.join(__dirname, './db/seeds.sql'), 'utf8');

        // Execute the SQL file
        await sequelize.query(seedSQL);

        console.log('Seed data has been inserted successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

seedData();