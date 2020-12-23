import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Instantiate required constructor fields
const cache = new InMemoryCache();
const link = createHttpLink({
  uri: "/subgraphs/name/execc/berezka-dao",
});

export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: link,

  // Provide some optional constructor fields
  name: "react-web-client",
  version: "1.3",
  queryDeduplication: true,
  shouldBatch: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    fetchOptions: {
      mode: "no-cors",
    },
  },
});
