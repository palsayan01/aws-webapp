import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from './../services/db-connect-services.js';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();

export const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            readOnly: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            writeOnly: true,
        },
        account_created: {
            type: DataTypes.DATE,
            readOnly: true,
            allowNull: false
        },
        account_updated: {
            type: DataTypes.DATE,
            readOnly: true,
            allowNull: false
        }
    },
    {
        timestamps: true,
        createdAt: 'account_created',
        updatedAt: 'account_updated',
        hooks: {
            beforeCreate: async (user) => {
                const salt_rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
                const hashedPassword = await bcrypt.hash(user.password, salt_rounds);
                user.password = hashedPassword;
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt_rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
                    const hashedPassword = await bcrypt.hash(user.password, salt_rounds);
                    user.password = hashedPassword;
                }
            },

        },

    },
);

User.sync()
  .then(() => {
    console.log('User table created successfully.');
  })
  .catch((error) => {
    console.error('Error creating User table:', error);
  });

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true