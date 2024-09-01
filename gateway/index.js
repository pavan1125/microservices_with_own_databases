// gateway/index.js
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken"
const startServre = async () => {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: "users", url: "http://localhost:3003/graphql" },
      { name: "orders", url: "http://localhost:3001/graphql" },
    ],
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.split(" ")[1];
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
        // Other shared context values or data sources
      };
    },
  });

  const app = express();
  const httpServer = http.createServer(app);
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  httpServer.listen(4000, () => {
    console.log(
      `Gateway running at http://localhost:4000${server.graphqlPath}`
    );
  });
};

startServre();
