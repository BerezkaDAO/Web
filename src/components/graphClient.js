import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";

// Instantiate required constructor fields
const cache = new InMemoryCache();

const berezkaDao = createHttpLink({
  uri: "/subgraphs/name/execc/berezka-dao",
});

const berezkaDaoRequest = createHttpLink({
  uri: "/subgraphs/name/execc/berezka-dao-request",
});

const berezkaDaoToken = createHttpLink({
  uri: "/subgraphs/name/execc/berezka-dao-tokens",
});

const testContext = (name) => (op) => {
  const ctx = op.getContext();
  return ctx && ctx.clientName === name;
};

const link = ApolloLink.split(
  testContext("tokens"),
  berezkaDaoToken,
  ApolloLink.split(testContext("request"), berezkaDaoRequest, berezkaDao)
);

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
