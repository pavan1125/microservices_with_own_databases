import {gql} from "apollo-server-express"

export const typeDefs=gql`
# directive @key(fields: String!) on OBJECT | INTERFACE
    type Query{
    getAllUsers:[User]
    getUserById(id:String):User
}
 

type User @key(fields: "id"){
    id: ID,
    name: String,
    password: String
}

extend type Query{
    getUser(id:String):User
}

 type Mutation{
    createUser(name:String,password:String):User
    deleteUser(id:String):String
 }
`