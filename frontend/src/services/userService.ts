import {ApolloQueryResult, gql} from '@apollo/client';
import gqlClient from '.';

interface User {
  github_id: Number;
  login: string;
  avatar_url: string;
  name: string;
}

interface IUserService {
  getUser(): Promise<void | ApolloQueryResult<User>>;
}

class UserService implements IUserService {
  async getUser(): Promise<any | ApolloQueryResult<User>> {
    return gqlClient
      .query({
        query: gql`
          query GetUser {
            me {
              github_id
              login
              avatar_url
              name
            }
          }
        `,
      })
      .catch(err => {
        console.log(`could not get user due to ${err}`);
        return {error: err};
      });
  }
}
export default UserService;
export type {User};
