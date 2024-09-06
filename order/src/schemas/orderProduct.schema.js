import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    getAllOrderProducts: [OrderProduct]
  }
  type User @key(fields: "id") {
    id: ID!
    name: String
  }
  type OrderProduct {
    id: ID!
    orderId: String
    productId: String
    order: Order
    quantity: Int
    product: Product @requires(fields: "productId")
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

  type Inventory {
    id: ID!
    sku: String
    quantity: Int
    reserved: Int
    createdAt: String
    updatedAt: String
    product: Product
  }
  scalar DateTime
  enum OrderStatus {
    PENDING
    COMPLETED
    CANCELED
  }

  type Order {
    id: String
    orderNumber: String
    orderDate: DateTime
    totalAmount: Float
    status: OrderStatus
    createdAt: DateTime
    updatedAt: DateTime

    products: [OrderProduct]
    userId: String
    productId: String
    user: User @requires(fields: "userId")
  }
  
  type OrderProductInput {
    orderId:String
    productId:String
    quantity:Int
  }
  type Mutation {
      addOrderProduct(orderProduct:OrderProductInput):OrderProduct
  }
`;
