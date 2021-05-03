const { db } = require('./db/mongoConnect')
const express = require('express')
const { ApolloServer, PubSub } = require('apollo-server-express')
const http = require('http')
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge")
const { loadFilesSync } = require("@graphql-tools/load-files")
const path = require('path')

const app = express()
app.use(express.json({ limit: '50mb' }));
require('dotenv').config()
//connect to mongoDB
db()

//used with subscriptions
const pubsub = new PubSub()

//will automatically merges any additional typeDefs
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')))
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')))

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        ...resolvers,
        Subscription: {
            postMade: {
             subscribe: () => pubsub.asyncIterator(["NEW_POST"])
            },
        }
    },
    context: ({ req, res }) => ({ req, res, pubsub }),
    subscriptions: {
        onConnect: (connectionParams, webSocket, context) => {
          console.log("XXXXXX")
          console.log(connectionParams)
        }
    }
});

const httpServer = http.createServer(app);

server.applyMiddleware({ app })
server.installSubscriptionHandlers(httpServer)

httpServer.listen(process.env.PORT, () => {
    console.log(`To access the server use http://localhost:${process.env.PORT}/graphql`)
    console.log(`Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`)
})

