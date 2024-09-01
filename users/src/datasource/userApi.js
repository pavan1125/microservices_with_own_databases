import {DataSource} from "apollo-datasource"
import db from "../db/index.js"
export class UserApi extends DataSource{
    constructor(){
        super()
    }

    async getUserById(id){
        try {
            return await db.user.findFirst({
                where:{
                    id
                }
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getAllUsers(){
        try {
            return await db.user.findMany();
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async createUser(name,password){
        try {
            const newUser = await db.user.create({
                data: {
                  name,
                  password,
                },
              });
      
              return newUser;
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async deleteUser(id){
        try {
            await db.user.delete({
                where:{
                    id
                }
            })
            return "user deleted successfully" 
        } catch (error) {
            console.log(error)
            return error
        }
    }
}