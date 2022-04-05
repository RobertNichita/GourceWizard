import {ExpressContext} from 'apollo-server-express';

export const userIdResolver =
  () =>
    (next: (arg0: any, arg1: any, arg2: any, arg3: any) => any) =>
      (root: any, args: any, context: ExpressContext, info: any) => {
        if (context.req.session.passport)
          context.req.userId = context.req.session.passport!.user.user.github_id;

    return next(root, args, context, info);
  };
