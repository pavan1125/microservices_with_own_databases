import { productConsumer } from "../../kafka/consumer.js";
import { kafka } from "../../kafka/index.js";
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
  Mutation: {
    addProduct: async (_, { product }, { dataSources }) => {
      try {
        const productAdded = await dataSources.productApi.addProductToDb(
          product
        );
        const productProducer = kafka.producer();
        await productProducer.connect();
        await productProducer.send({
          topic: "product_added",
          messages: [{ value: JSON.stringify(productAdded) }],
        });
        await productProducer.disconnect();
        await productConsumer(dataSources)
        return productAdded;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    deleteProduct: async (_, { sku }, { dataSources }) => {
      try {
        const productExist = await dataSources.productApi.getProductBySku(sku);
        if (!productExist) {
          throw new Error(`Product ${sku} does not exist`);
        }
        const productProducer = kafka.producer();
        await productProducer.connect();
        await productProducer.send({
          topic: "product_deleted",
          messages: [{ value: JSON.stringify(sku) }],
        });
        await productProducer.disconnect();
        return await productConsumer(dataSources);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};
