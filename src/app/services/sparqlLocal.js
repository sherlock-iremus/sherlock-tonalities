import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sparqlLocalEndpoint = createApi({
  reducerPath: "sparqlApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3030/tonalities" }),
  endpoints: (builder) => ({
    sparql: builder.query({
      query: (sparqlQuery) => ({
        url: "/sparql",
        method: "POST",
        body: new URLSearchParams({ query: sparqlQuery }),
      }),
    }),
  }),
});

export default sparqlLocalEndpoint;

export const { useSparqlQuery } = sparqlLocalEndpoint;
