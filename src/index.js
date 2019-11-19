const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

//dummy data
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Full stack GraphQL tutorial'
}]

//idCount is how many links there are in the array, this will be used for generating new id's
let idCount = links.length
const resolvers = {
    //resolver needed for each typedef
    //name needs to match
    Query,
    Mutation,
    User,
    Link
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma,
        }
    },
})

server.start(() => console.log(`Server is running on http://localhost:4000`))