const { db } = require('./db/mongoConnect')
const express = require('express')
const { ApolloServer, PubSub, gql } = require('apollo-server-express')
const http = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge")
const { loadFilesSync } = require("@graphql-tools/load-files")
const path = require('path')

const app = express()
app.use(express.json({ limit: '50mb' }));
require('dotenv').config()

//connect to mongoDB
db()

//will automatically merges any additional typeDefs
// const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, '../typeDefs')))
// const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, '../resolvers')))

//used with subscriptions
const pubsub = new PubSub()

//subscriptions == https://www.apollographql.com/docs/apollo-server/data/subscriptions/#gatsby-focus-wrapper

// Schema definition
const typeDefs = gql`
  type Query {
    currentNumber: Int
  }

  type Subscription {
    numberIncremented: Int
  }
`;

let currentNumber = 0;
function incrementNumber() {
  currentNumber++;
  pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}

// Start incrementing
incrementNumber();

// Resolver map
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    }
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
    },
  }
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: (connectionParams, webSocket, context) => {
          console.log("XXXXXX")
          console.log(connectionParams)
        }
    },
    context: ({ req, res }) => ({ req, res, pubsub })
});

const httpServer = http.createServer(app);

server.applyMiddleware({ app })
server.installSubscriptionHandlers(httpServer)

httpServer.listen(process.env.PORT, () => {
    console.log(`To access the server use http://localhost:${process.env.PORT}/graphql`)
    console.log(`Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`)
})

