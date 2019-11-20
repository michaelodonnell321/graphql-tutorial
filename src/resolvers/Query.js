//if no filter string is provided, the were object will be an empty object
//if there is, object is constructed that expresses the two filter conditions above
//where arg is used by Prisma to filter out those Link elements that don't adhere

async function feed(parent, args, context, info) {
    const where = args.filter ? {
        OR: [
            { description_contains: args.filter },
            { url_contains: args.filter },
        ],
    } : {}

    const links = await context.prisma.links({
        where,
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy
    })
    return links
}

module.exports = {
    feed,
}