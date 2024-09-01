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
        const userFromDb= await dataSources.userApi.getUserById(user.id)
        if(!userFromDb){
          return "user not found please sign up"
        }
        order.userId=userFromDb.id
        order.orderNumber=generateRandomString(6)
        return await dataSources.ordersApi.addOrder(order);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  Order: {
    user: async (order, _, { dataSources }) => {
      return { __typename: "User", id: order.userId };
    },
  },
};
