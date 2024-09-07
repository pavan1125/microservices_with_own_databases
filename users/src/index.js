import express from "express";
import {ApolloServer} from "apollo-server-express"
import { typeDefs } from "./schemas/user.schema.js";
import { resolvers } from "./resolvers/user.resolver.js";
import http from "http"
import { UserApi } from "./datasource/userApi.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSubgraphSchema } from "@apollo/federation";

const startServer=async()=>{
  const app = express();
  app.use(express.json());
  const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context:()=>({
    dataSources:{
      userApi: new UserApi()
    }
  })
});
  await server.start()
  server.applyMiddleware({app,path:'/graphql'})
  httpServer.listen(3003, () => {
    console.log("user service is listening on port 3003");
  });
}

startServer()