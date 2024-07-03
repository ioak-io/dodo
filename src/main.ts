if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}

const { ApolloServer } = require("apollo-server-express");
import { authorize } from "./middlewares";
import mongoose from "mongoose";
import { initializeSequences } from "./startup";
const express = require("express");
const cors = require("cors");

var ApiRoute = require("./route");

const gqlScalarSchema = require("./modules/gql-scalar");
const assetSchema = require("./modules/asset");

const databaseUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose.connect(databaseUri, {});
mongoose.pluralize(undefined);

const app = express();

const server = new ApolloServer({
  typeDefs: [gqlScalarSchema.typeDefs, assetSchema.typeDefs],
  resolvers: [gqlScalarSchema.resolvers, assetSchema.resolvers],
  context: ({ req, res }: any) => {
    const token = req.headers.authorization || "";
    return { token };
  },
  introspection: true,
  playground: true,
});

server.start().then(() => server.applyMiddleware({ app }));

app.use(cors());

app.get("/hello", (_: any, res: any) => {
  res.send(
    "basic connection to server works. database connection is not validated"
  );
  res.end();
});

app.use(express.json({ limit: 5000000 }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/api", ApiRoute);

app.use((_: any, res: any) => {
  res.status(404);
  res.send("Not found");
  res.end();
});

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).send(err.stack);
  // .send(err.name + ": " + err.message + "\n\nDetails:\n" + err.stack);
});

const variableToSetTimeout = app.listen(
  { port: process.env.PORT || 4000 },
  () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${
        server.graphqlPath
      }`
    )
);

variableToSetTimeout.timeout = 300000;

// server
//   .listen({ port: process.env.PORT || 4000 })
//   .then(({ url }: any) => console.log(`Server started at ${url}`));

// Server startup scripts
initializeSequences();

// process.on("uncaughtException", (err) => {
//   console.log(`Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });
