const { ApolloServer } = require('apollo-server')
const { db } = require('./db/mongoConnect')
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge")
const { loadFilesSync } = require("@graphql-tools/load-files")
const path = require('path')
require('dotenv').config()

//connect to mongoDB
db()

// will automatically merges any additional typeDefs
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs'))) 
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')))

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
    console.log(`Apollo Server ready at ${url}`)
   });

