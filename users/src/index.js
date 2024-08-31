import express from "express";
// import {router} from "./routes/user.route.js";
import {ApolloServer} from "apollo-server-express"
import { typeDefs } from "./schemas/user.schema.js";
import { resolvers } from "./resolvers/user.resolver.js";

const startServer=async()=>{
  const app = express();
  app.use(express.json());
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })
  await server.start()
  server.applyMiddleware({app,path:'/graphql'})
  // app.use(router);
  app.listen(3003, () => {
    console.log("user service is listening on port 3003");
  });
}

startServer()