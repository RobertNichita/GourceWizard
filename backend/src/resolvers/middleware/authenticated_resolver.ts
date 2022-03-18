import { AuthenticationError, ExpressContext } from "apollo-server-express"

export const isAuthenticatedResolver = () =>
    (next: (arg0: any, arg1: any, arg2: any, arg3: any) => any) =>
        (root: any, args: any, context: ExpressContext, info: any) => {

            if (!context.req.isAuthenticated()) {
                throw new AuthenticationError('Unauthenticated user')
            }

            return next(root, args, context, info)
        }

