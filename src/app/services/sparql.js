import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getNoteInfo, getNotesOnFirstBeat } from "./sparqlQueries";

export const sparqlEndpoint = createApi({
  reducerPath: "sparqlApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://data-iremus.huma-num.fr/sparql" }),
  endpoints: (builder) => ({
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

export default sparqlEndpoint;

export const { useGetNotesOnFirstBeatQuery, useGetNoteInfoQuery } = sparqlEndpoint;
