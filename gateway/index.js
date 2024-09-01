// gateway/index.js
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
import express from "express";
import http from "http";
const startServre= async()=>{
    const gateway = new ApolloGateway({
        serviceList: [
          { name: "users", url: "http://localhost:3003/graphql" },
          { name: "orders", url: "http://localhost:3001/graphql" },
        ],
      });
      
      const server = new ApolloServer({
        gateway,
        subscriptions: false,
      });
      
      const app = express();
      const httpServer = http.createServer(app);
      await server.start()
      server.applyMiddleware({ app,path:"/graphql" });
      
      httpServer.listen(4000, () => {
        console.log(`Gateway running at http://localhost:3000${server.graphqlPath}`);
      });
}

startServre()