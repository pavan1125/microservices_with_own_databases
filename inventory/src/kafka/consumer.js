import { kafka } from "../kafka/index.js";
export const productConsumer = async (dataSources) => {
  const consumer = kafka.consumer();
  await consumer.connect();
  await consumer.subscribe({
    topics: ["product_added", "product_deleted"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      //add the item to the inventory with the same sku
      try {
        let messageValue = JSON.parse(message.value);
        if (topic === "product_deleted") {
          await dataSources.inventoryApi.deleteInventoryFromDb(messageValue);
          await dataSources.ordersApi.deleteProductFromDb(messageValue);
          return;
        }
        const inventoryAdded = await dataSources.inventoryApi.addInventoryToDb({
          sku: messageValue.sku,
          quantity: 0,
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
};
