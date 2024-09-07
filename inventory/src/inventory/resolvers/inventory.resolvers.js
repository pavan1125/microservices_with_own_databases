export const resolvers = {
  Query: {
    getAllInventory: async (_, __, { dataSources }) => {
      try {
        const inventories =
          await dataSources.inventoryApi.getAllInventoriesFromDb();
        return inventories;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getInventoryById: async (_, { id }, { dataSources }) => {
      try {
        const inventory = await dataSources.inventoryApi.getInventoryByIdFromDb(
          id
        );
        return inventory;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  Mutation: {
    updateStock: async (_, { sku, quantity }, { dataSources }) => {
      try {
        const updated = await dataSources.inventoryApi.updateStockInDb(
          sku,
          quantity
        );
        return updated;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};
