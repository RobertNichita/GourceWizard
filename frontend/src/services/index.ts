import frontEndConfig from '../config';
import {ApolloClient, InMemoryCache} from '@apollo/client';

const gqlClient = new ApolloClient({
  uri: `${frontEndConfig.api_url}`,
  cache: new InMemoryCache(),
  credentials: 'include',
});

export default gqlClient;
