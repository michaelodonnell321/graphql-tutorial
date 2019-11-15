const { GraphQLServer } = require('graphql-yoga');

//dummy data
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Full stack GraphQL tutorial'
}]

const resolvers = {
    //resolver needed for each typedef
    //name needs to match
    Query: {
        info: () => 'This is the API for the Hackernews Clone',
        feed: () => links,
    },
    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url,
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))