import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createApolloClient = () => {
    const client = new ApolloClient({
        uri: "/api/",
        cache: new InMemoryCache({
            addTypename: false,
        }),
    });

    return client;
};
