import { ExpressContext } from "apollo-server-express";

export const resolvers = {
  Query: {
    me: (parent: any, args: any, context: ExpressContext, info: any) => context.req.user,
  }
}