const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const http = require('http')
const { db } = require('./db/mongoConnect')
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge")
const { loadFilesSync } = require("@graphql-tools/load-files")
const path = require('path')
require('dotenv').config()

const app = express()
app.use(express.json({limit: '50mb'}));
//connect to mongoDB
db()

//will automatically merges any additional typeDefs
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs'))) 
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')))


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => (req, res)
});

//Connect apollo server to http;
apolloServer.applyMiddleware({ app })
const httpServer = http.createServer(app)

httpServer.listen(process.env.PORT, () => {
    console.log(`To access the server use http://localhost:${process.env.PORT}/graphql`)
})

