import frontEndConfig from '../config';
import {ApolloClient, HttpLink, from, InMemoryCache} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {setError} from '../components/navigation/AppBanner';

const httpLink = new HttpLink({
  uri: `${frontEndConfig.url}/graphql/`,
});

function handleUnauthenticatedUser(): void {
  window.location.href = `${frontEndConfig.url}/unauthenticated`;
}

function handleBadInput(message: string): void {
  const error = JSON.parse(message);
  const title = JSON.stringify(Object.keys(error));
  const description = JSON.stringify(Object.values(error));
  setError('error', {title, description});
}

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({message, locations, path, extensions}) => {
      switch (extensions.code) {
        case 'UNAUTHENTICATED':
          handleUnauthenticatedUser();
          break;
        case 'BAD_USER_INPUT':
          handleBadInput(message);
          break;
        default:
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
      }
    });
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const gqlClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  credentials: 'include',
});

export default gqlClient;
