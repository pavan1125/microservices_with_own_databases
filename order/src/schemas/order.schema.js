import { gql } from "apollo-server-express";
export const typeDefs = gql`
#  directive @key(fields: String!) on OBJECT | INTERFACE
#  directive @requires(fields: String!) on FIELD_DEFINITION
#  type Query {
#   # getAllOrders: [Order]
# }
extend type Query {
  getAllOrders: [Order]
}

type Mutation {
  addOrder(order:OrderInput):Order
}

type Order {
  id: String
  orderNumber: String
  orderDate: Date
  totalAmount: Float
  status: OrderStatus
  createdAt: DateTime
  updatedAt: DateTime

  products: [OrderProduct]
  userId: String 
  productId: String
  user:User @requires(fields: "userId")
}

type User @key(fields: "id") {
  id: ID!
}

type OrderProduct {
  orderId: String
  productId: String
  quantity: Int

  order: Order
  product: ProductInfo 
}


type ProductInfo {
  id: String
  name: String
  description: String
  price: Float
  sku: String
}

scalar Date
scalar DateTime
enum OrderStatus {
  PENDING
  COMPLETED
  CANCELED
}

input OrderInput {
  id: String
  orderNumber: String
  orderDate: Date
  totalAmount: Float
  status: OrderStatus
  createdAt: DateTime
  updatedAt: DateTime
  userId: String
  productId: String
  products: [OrderProductInput]
}

input OrderProductInput {
  orderId: String
  productId: String
  quantity: Int
}

`;
