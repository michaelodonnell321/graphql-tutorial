const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    //encrypt password using bcryptjs
    const password = await bcrypt.hash(args.password, 10)
    //use prisma client instance to store the new user in the DB
    const user = await context.prisma.createUser({...args, password})
    //generating a JWT which is signed with APP_SECRET
    const token = jwt.sign({ userId: user.id}, APP_SECRET)
    //return token and user that adheres to the AuthPayload object from the GraphQL schema
    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    //use prisma client instance to retrieve existing user record from email address
    //if no user with that email is found, return error
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found')
    }

    //compare password with password stored in DB, if no match, return error
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id}, APP_SECRET)

    //return token and user, adheres to schema same as above
    return {
        token,
        user,
    }
}

//POST
//using getUserId function to get ID of user
//this is tored in the JWT that's set at the Authorization header of the incoming HTTP request
//therefore, we know that user is creating the link
//use that userId to connect the Link to the User who is creating it
function post(parent, args, context, info) {
    const userId = getUserId(context)
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
    })
}

async function vote(parent, args, context, info) {
    //validate incoming JWT with the getUserId function
    //if valid, return userId of user who is making request
    //if not valid, function will throw exception
    const userId = getUserId(context)

    //verifying that user has not previously voted by using .$exists function, which returns true if exists
    //link is identifed by args.linkId
    const linkExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: args.linkId },
    })
    if (linkExists) {
        throw new Error(`Already voted for link: ${args.linkId}`)
    }

    //if exists returns false, createVote will be used to create a new Vote that is connected to User and Link
    return context.prisma.createVote({
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } },
    })
}

module.exports = {
    signup,
    login,
    post,
    vote,
}