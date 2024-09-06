export const resolvers = {
  Query: {
    getAllOrderProducts: async (_, __, { dataSources }) => {
      try {
        const orderProducts =
          await dataSources.orderProductsApi.getAllOrderProductsFromDb();
        return orderProducts;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  Mutation: {
    OrderProduct: async (orderProduct, _, { dataSources }) => {
      try {
        //TODO: add the productApi to the dataSource
        const product = await dataSources.productApi.getProductById(
          orderProduct.productId
        );
        return product;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    addOrderProduct: async (orderProduct, _, { dataSources }) => {
      try {
        const orderProductAdded =
          await dataSources.orderProductApi.addOrderProductToDb(orderProduct);
        return orderProductAdded;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};
