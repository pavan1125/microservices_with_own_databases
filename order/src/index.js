import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs as orderTypeDefs } from "./schemas/order.schema.js";
import { resolvers as orderResolvers } from "./resolvers/order.resolvers.js";
import { typeDefs as orderProductTypeDefs } from "./schemas/orderProduct.schema.js";
import { resolvers as orderProductResolvers } from "./resolvers/orderProduct.resolvers.js";
import http from "http";
import { OrderApi } from "./datasource/orderApi.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSubgraphSchema } from "@apollo/federation";
import jwt from "jsonwebtoken";
import { UsersAPI } from "./datasource/userApi.js";
import { url } from "inspector";
import { OrderProductApi } from "./datasource/orderProduct.js";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { ProductApi } from "./datasource/productApi.js";
import { InventoryApi } from "./datasource/inventoryApi.js";

const app = express();
app.use(express.json());

const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs: mergeTypeDefs([orderTypeDefs, orderProductTypeDefs]),
    resolvers: mergeResolvers([orderResolvers, orderProductResolvers]),
  }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, "secret");
      } catch (error) {
        console.error("JWT verification failed:", error);
      }
    }
    return {
      user,
      dataSources: {
        ordersApi: new OrderApi(),
        usersApi: new UsersAPI({ url: "http://localhost:3003/graphql" }),
        orderProductsApi: new OrderProductApi(),
        productApi: new ProductApi({ url: "http://localhost:3002/graphql" }),
        inventoryApi: new InventoryApi({
          url: "http://localhost:3002/graphql",
        }),
      },
    };
  },
});
await server.start();
server.applyMiddleware({ app, path: "/graphql" });
httpServer.listen(3001, () => {
  console.log("order service is listening on port 3001");
});
