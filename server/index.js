const { ApolloServer, mergeTypeDefs, mergeResolvers, loadFilesSync } = require('apollo-server')
const { db } = require('./db/mongoConnect')
const resolvers = require('./resolvers/user')
const typeDefs = require('./typeDefs/user')
require('dotenv').config()

//connect to mongoDB
db()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        const user = getUser(token);
        return { user };
    },
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
   });