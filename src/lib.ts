import { ApolloClient, InMemoryCache } from "@apollo/client";
import { StytchUIClient } from "@stytch/vanilla-js";

// TODO: Temporarily hard-coded
export const stytchClient = new StytchUIClient(
  "public-token-test-62177c24-f8f4-4ddd-962b-0436b445ccaa",
);

// TODO: Refactor to be dynamic. Local dev uri must be device IP.
export const apolloClient = new ApolloClient({
  uri: "https://api.subquery.network/sq/burnt-labs/xion-indexer",
  cache: new InMemoryCache(),
  assumeImmutableResults: true,
});
