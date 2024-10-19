import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let status;
export const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT
});

export const dbAuth = async () => {
  try {
    await sequelize.authenticate();
    status = 200;
    console.log('Connection has been established successfully.');
  } catch (error) {
    status = 503;
    console.error('Unable to connect to the database');
  }

  return status;
}