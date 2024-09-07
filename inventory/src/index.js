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


await server.start();
server.applyMiddleware({ app, path: "/graphql" });
httpServer.listen(3002, () => {
  console.log("inventory service is listening on port 3002");
});
