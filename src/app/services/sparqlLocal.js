import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getNoteInfo, getNotesOnFirstBeat } from "./sparqlQueries";

export const sparqlLocalEndpoint = createApi({
  reducerPath: "sparqlApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3030/tonalities" }),
  endpoints: (builder) => ({
    countTriples: builder.query({
      query: () => ({
        url: "/sparql",
        method: "POST",
        body: new URLSearchParams({ query: 'SELECT (COUNT(?s) AS ?triples) WHERE { ?s ?p ?o }' }),
      }),
    }),
    getNotesOnFirstBeat: builder.query({
      query: noteIri => ({
        url: "/sparql",
        method: "POST",
        body: new URLSearchParams({ query: getNotesOnFirstBeat(noteIri) }),
      }),
    }),
    getNoteInfo: builder.query({
      query: noteIri => ({
        url: "/sparql",
        method: "POST",
        body: new URLSearchParams({ query: getNoteInfo(noteIri) }),
      }),
    })
  }),
});

export default sparqlLocalEndpoint;

export const { useCountTriplesQuery, useGetNotesOnFirstBeatQuery, useGetNoteInfoQuery } = sparqlLocalEndpoint;
