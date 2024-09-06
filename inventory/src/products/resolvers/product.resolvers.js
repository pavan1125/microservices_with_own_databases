export const resolvers = {
  Query: {
    getAllProducts: async (_, __, { dataSources }) => {
      try {
        const products = await dataSources.productApi.getAllProductsFromDb();
        return products;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getProductById: async (id, __, { dataSources }) => {
      try {
        const product = await dataSources.productApi.getProductByIdFromDb(id);
        return product;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};
