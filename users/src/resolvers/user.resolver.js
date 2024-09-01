import db from "../db/index.js";
import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    getAllUsers: async (_,__,{dataSources}) => {
      try {
        return await dataSources.userApi.getAllUsers();
      } catch (error) {
        console.log(error);
        return error
      }
    },
    getUserById:async(_,{id},{dataSources})=>{
      try {
        return await dataSources.userApi.getUserById(id)
      } catch (error) {
        console.log(error)
        return error
      }
    }
  },
  Mutation: {
    createUser: async (_, { name, password },{dataSources}) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return dataSources.userApi.createUser(name, hashedPassword)
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
      }
    },
    deleteUser: async (_,{id},{dataSources})=>{
        try {
         dataSources.userApi.deleteUser(id)
        return "user deleted successfully"
        } catch (error) {
            console.log(error)
            throw new Error('Error while deleting user')
        }
    }
  },
};
