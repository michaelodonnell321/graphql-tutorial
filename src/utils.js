const jwt = require('jsonwebtoken')
const APP_SECRET = 'CorrectHorseBatteryStaple'

//helper function that is called in resolvers which require authentication
//if not successful, not authenticated returned
function getUserId(context) {
    const Authorization = context.request.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { userId } = jwt.verify(token, APP_SECRET)
        return userId
    }

    throw new Error('Not authenticated')
}

module.exports = {
    APP_SECRET,
    getUserId,
}