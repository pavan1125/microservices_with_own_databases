
export const resolvers={
    Query:{
        getAllOrders:async(_,__,{dataSources})=>{
            return await dataSources.ordersApi.getAllOrders()
        }
    },
    Order: {
        user: async (order, _, { dataSources }) => {
          return { __typename: 'User', id: order.userId };
        },
      },
}