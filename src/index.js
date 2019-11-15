const { GraphQLServer } = require('graphql-yoga');

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
    Query: {
        info: () => 'This is the API for the Hackernews Clone',
        feed: () => links,
    },
    Mutation: {
        //adds new link object, adds to existing links list, then returns the newly created link
        //args carries the arguments for the operation, url and description for the link in this case
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
        }
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