import express from "express";
import http from "http";
import { buildSubgraphSchema } from "@apollo/federation";
import { typeDefs as productTypeDefs } from "./products/schemas/product.schema.js";
import { typeDefs as inventoryTypeDefs } from "./inventory/schemas/inventory.schema.js";
import { resolvers as productResolvers } from "./products/resolvers/product.resolvers.js";
import { resolvers as inventoryResolvers } from "./inventory/resolvers/inventory.resolvers.js";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ProductApi } from "./products/dataSource/productApi.js";
import { InventoryApi } from "./inventory/dataSource/inventoryApi.js";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
// import { router as inventoryRoutes } from "./inventory/routes/inventory.route.js";
// import { router as productRoutes } from "./products/routes/product.route.js";
// import { kafka } from "../../shared/src/index.js";
// import {
//   addInventoryToDb,
//   addStockToInventory,
//   deleteInventory,
// } from "./inventory/services/inventory.services.js";
// import {
//   deleteProductBySku,
//   getProductById,
//   getProductBySku,
// } from "./products/controllers/product.controller.js";
// import { getInventoryBySku } from "./inventory/controllers/inventory.controller.js";

const app = express();
app.use(express.json());
const httpServer = http.createServer(app);
const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs: mergeTypeDefs([inventoryTypeDefs, productTypeDefs]),
    resolvers: mergeResolvers([inventoryResolvers, productResolvers]),
  }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req }) => ({
    dataSources: {
      productApi: new ProductApi(),
      inventoryApi: new InventoryApi(),
    },
  }),
});
// app.use(inventoryRoutes);
// app.use(productRoutes);

// const consumer = kafka.consumer({ groupId: "products" });

// const runConsumer = async () => {
//   await consumer.connect();
//   await consumer.subscribe({
//     topics: ["product_added", "product_deleted", "order_status_updated"],
//     fromBeginning: true,
//   });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       //add the item to the inventory with the same sku
//       try {
//         let messageValue = JSON.parse(message.value);
//         if (topic === "product_deleted") {
//           await deleteInventory(messageValue);
//           await deleteProductBySku(messageValue);
//           return;
//         }
//         if (topic === "order_status_updated") {
//           console.log("asdas", messageValue);
//           if (messageValue.status === "PENDING") {
//             return;
//           }
//           if (messageValue.status === "SHIPPED") {
//             const products = messageValue.products;
//             products.forEach(async (product) => {
//               const pro = await getProductById(product.productId);
//               const inventory = await getInventoryBySku(pro.sku);
//               console.log({ pro, inventory });
//               const stockNeedToRemove = product.quantity;
//               const updatedStock = inventory.quantity - stockNeedToRemove;
//               await addStockToInventory(inventory.sku, updatedStock);
//             });
//           }
//           if (messageValue.status === "DELIVERED") {
//             return;
//           }
//           if (messageValue.status === "CANCELLED") {
//             return;
//           }
//           return;
//         }
//         const inventoryAdded = await addInventoryToDb({
//           sku: messageValue.sku,
//           quantity: 0,
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     },
//   });
// };

// runConsumer().catch(console.error);
await server.start();
server.applyMiddleware({ app, path: "/graphql" });
httpServer.listen(3002, () => {
  console.log("inventory service is listening on port 3002");
});
