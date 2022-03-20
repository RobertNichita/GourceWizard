import {AuthenticationError, ExpressContext} from 'apollo-server-express';
import {authKit} from '../../controllers/octokit';

export const isAuthenticatedResolver =
  () =>
  (next: (arg0: any, arg1: any, arg2: any, arg3: any) => any) =>
  (root: any, args: any, context: ExpressContext, info: any) => {
    if (!context.req.isAuthenticated()) {
      throw new AuthenticationError('Unauthenticated user');
    }

    return next(root, args, context, info);
  };
//   function addAuthKit(req: Request, res: Response, next: NextFunction) {
//   req.kit = authKit(req.session.passport!.auth.accessToken);
//   return next();
// }
//prerequisite: user is authenticated
export const addAuthKit =
  () =>
  (next: (arg0: any, arg1: any, arg2: any, arg3: any) => any) =>
  (root: any, args: any, context: ExpressContext, info: any) => {
    context.req.kit = authKit(
      context.req.session.passport!.user.auth.access_token
    );
    return next(root, args, context, info);
  };

// This is the response of the graphql stuff.
// We should error out if unauthenticated users try to render a video
// does it not make sense to just redirect to the login page, and add an error field??
// Depends. Lets talk about it later.
// maybe we redirect from the frontend...
