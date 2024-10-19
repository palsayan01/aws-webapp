import { Sequelize } from 'sequelize';
import { User } from '../models/users.js';
import dotenv from 'dotenv';
dotenv.config();

export const userCreate = async (body) => {
    const {account_created, account_updated, id, ...newUser} = body;
    const userExists = await getUser(newUser.email);
    if (userExists) {
      return null;
    }
    else { 
      const userCreated = await User.create(newUser);
      let response = userCreated.toJSON();
      delete response.password;
      return response;
    }
  
  }

  export const getUser = async (email) => {
    const user = await User.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
  
    if (user) {
      return user;
    }
  
    return null;
    
  }


  export const userUpdate = async (request) => {
    const email = request.email;
    const userExists = await User.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
  
    if (userExists) {
      userExists.set({ ...userExists.dataValues, ...request.body })
      await userExists.save();
      return userExists;
    }
  
    else {
      return null;
    }
    
  
  
  }