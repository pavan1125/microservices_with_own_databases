import db from "../db/index.js";
import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    getAllUsers: async () => {
      return await db.user.findMany();
    },
    getUserById:async(_,{id})=>{
        return await db.user.findFirst({
            where:{
                id
            }
        })
    }
  },
  Mutation: {
    createUser: async (_, { name, password }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
          data: {
            name,
            password: hashedPassword,
          },
        });

        return newUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
      }
    },
    deleteUser: async (_,{id})=>{
        try {
         await db.user.delete({
            where:{
                id
            }
        })
        return "user deleted successfully"
        } catch (error) {
            console.log(error)
            throw new Error('Error while deleting user')
        }
    }
  },
};
