import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    getAllProducts: [Product]
    getProductById(id:ID!): Product
  }
  
  type Mutation{
    addProduct(product:productInput):Product
    deleteProduct(sku:String):Product
  }
  type Inventory {
    id: ID!
    sku: String
    quantity: Int
    reserved: Int
    createdAt: String
    updatedAt: String

    product: Product
  }
  type Product {
    id: ID!
    name: String
    description: String
    price: Float
    sku: String
    createdAt: String
    updatedAt: String
    orderIds: [String]
    orderProductIds: [String]
    inventory: Inventory
  }
  input productInput{
    name: String
    description: String
    price: Float
    sku: String
  }
`;
