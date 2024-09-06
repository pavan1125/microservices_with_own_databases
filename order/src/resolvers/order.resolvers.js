
import {generateRandomString} from "../utils/common.js"
export const resolvers = {
  Query: {
    getAllOrders: async (_, __, { dataSources }) => {
      return await dataSources.ordersApi.getAllOrders();
    },
  },
  Mutation: {
    addOrder: async (_, {order}, { dataSources,user }) => {
      try {
        if(!user){
          return "need to login to add order"
        }
        const userFromDb= await dataSources.usersApi.getUserById(user.id)        
        if(!userFromDb){
          return "user not found please sign up"
        }
        order.userId=userFromDb.id
        order.orderNumber=generateRandomString(6)
        return await dataSources.ordersApi.addOrderToDb(order);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  Order: {
    user: async (order, _, { dataSources }) => {
      const user= await dataSources.usersApi.getUserById(order.userId)
      return user
    },
  },
};
