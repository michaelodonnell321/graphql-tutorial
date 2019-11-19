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

module.exports = {
    signup,
    login,
    post,
}