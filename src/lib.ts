import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { createStytchHeadlessClient } from "@stytch/nextjs/headless";
import { StytchHeadlessClient } from "@stytch/vanilla-js/dist/index.headless";

let stytchClientInstance: StytchHeadlessClient;
let apolloClientInstance: ApolloClient<NormalizedCacheObject>;

export const getStytchClient = (token?: string) => {
  if (!stytchClientInstance) {
    stytchClientInstance = createStytchHeadlessClient(
      token || "public-token-test-62177c24-f8f4-4ddd-962b-0436b445ccaa",
    );
  }
  return stytchClientInstance;
};

export const getApolloClient = (uri?: string) => {
  if (!apolloClientInstance) {
    apolloClientInstance = new ApolloClient({
      uri: uri || "https://api.subquery.network/sq/burnt-labs/xion-indexer",
      cache: new InMemoryCache(),
      assumeImmutableResults: true,
    });
  }
  return apolloClientInstance;
};
