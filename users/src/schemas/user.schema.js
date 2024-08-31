import {gql} from "apollo-server-express"

export const typeDefs=gql`
    type Query{
    getAllUsers:[User]
    getUserById(id:String):User
}
 

type User{
    id: ID,
    name: String,
    password: String
}

 type Mutation{
    createUser(name:String,password:String):User
    deleteUser(id:String):String
 }
`