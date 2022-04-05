import {AuthenticationError, ExpressContext} from 'apollo-server-express';
import {authKit} from '../../controllers/octokit';
import {
  getInstallationKit,
  getUserInstallation,
} from '../../middleware/authentication';
import {log} from '../../logger';

export const isAuthenticatedResolver =
  () =>
  (next: (arg0: any, arg1: any, arg2: any, arg3: any) => any) =>
  async (root: any, args: any, context: ExpressContext, info: any) => {
    if (!context.req.isAuthenticated()) {
      throw new AuthenticationError('Unauthenticated user');
    }
    return getUserInstallation(
      authKit(context.req.session.passport!.user.auth.access_token)!
    ).then(installation => {
      if (!installation) {
        throw new AuthenticationError('User has not installed app');
      }

      return next(root, args, context, info);
    });
  };

//prerequisite: user is authenticated
export const addAuthKit =
  () =>
  (next: (arg0: any, arg1: any, arg2: any, arg3: any) => any) =>
  async (root: any, args: any, context: ExpressContext, info: any) => {
    return getInstallationKit(
      context.req.session.passport!.user.auth.access_token
    ).then(kit => {
      context.req.kit = kit;
      return next(root, args, context, info);
    });
  };
