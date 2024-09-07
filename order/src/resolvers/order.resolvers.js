import { generateRandomString } from "../utils/common.js";
import { kafka } from "../kafka/index.js";
import { orderProductConsumer } from "../kafka/consumer.js";
export const resolvers = {
  Query: {
    getAllOrders: async (_, __, { dataSources }) => {
      return await dataSources.ordersApi.getAllOrders();
    },
  },
  Mutation: {
    addOrder: async (_, { order }, { dataSources, user }) => {
      try {
        if (!user) {
          return "need to login to add order";
        }
        const userFromDb = await dataSources.usersApi.getUserById(user.id);
        if (!userFromDb) {
          return "user not found please sign up";
        }
        order.userId = userFromDb.id;
        order.orderNumber = generateRandomString(6);
        return await dataSources.ordersApi.addOrderToDb(order);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    deleteOrder: async (_, { id }, { dataSources }) => {
      try {
        const order = await dataSources.ordersApi.getOrderById(id);
        if (!order) {
          throw new Error(`Order ${id} not found`);
        }
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
          topic: "order_deleted",
          messages: [{ value: JSON.stringify(order) }],
        });
        await producer.disconnect();
        // const deleted= await dataSources.ordersApi.deleteOrderFromDb(id)
        // return deleted
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    updateOrderStatus: async (_, { id, status }, { dataSources }) => {
      try {
        const updatedOrder = await dataSources.ordersApi.updateOrderStatus(
          id,
          status
        );
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
          topic: "order_status_updated",
          messages: [{ value: JSON.stringify(updatedOrder) }],
        });
        producer.disconnect();
        await orderProductConsumer(dataSources);
        return updateStatus;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  Order: {
    user: async (order, _, { dataSources }) => {
      const user = await dataSources.usersApi.getUserById(order.userId);
      return user;
    },
  },
};
