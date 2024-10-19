import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { User } from '../models/users.js';
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
});

export const checkDbConnection = async (req, res, next) => {
    try {

        await sequelize.authenticate();
        User.sync()
            .then(() => {
                console.log('User table created successfully.');
            })
            .catch((error) => {
                console.error('Error creating User table');
            });

        console.log(User === sequelize.models.User); // true
        next();
    } catch (error) {
        console.error('Unable to connect to the database:');
        return res.status(503).json();
    }
};
