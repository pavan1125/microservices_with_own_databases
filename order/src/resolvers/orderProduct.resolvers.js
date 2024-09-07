import { orderProductConsumer } from "../kafka/consumer.js";
import { kafka } from "../kafka/index.js";
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
    addOrderProduct: async (_, { orderProduct }, { dataSources, user }) => {
      try {
        if (!user) {
          return "need to login to add order";
        }
        const userFromDb = await dataSources.usersApi.getUserById(user.id);
        if (!userFromDb) {
          return "user not found please sign up";
        }
        // const orderProductAdded =
        // await dataSources.orderProductsApi.addOrderProductToDb(orderProduct);
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
          topic: "order_product_added",
          messages: [
            { value: JSON.stringify({ orderProduct, userId: user.id }) },
          ],
        });
        return await orderProductConsumer(dataSources);
        // return orderProductAdded;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  OrderProduct: {
    product: async (orderProduct, _, { dataSources }) => {
      try {
        const product = await dataSources.productApi.getProductById(
          orderProduct.productId
        );
        return product;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};
