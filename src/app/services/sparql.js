import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAnnotations, getNoteInfo, getNotesOnFirstBeat } from './sparqlQueries'

export const sparqlEndpoint = createApi({
  reducerPath: 'sparqlApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://data-iremus.huma-num.fr/sparql' }),
  endpoints: builder => ({
    getNotesOnFirstBeat: builder.query({
      query: noteIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getNotesOnFirstBeat(noteIri) }),
      }),
    }),
    getNoteInfo: builder.query({
      query: noteIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getNoteInfo(noteIri) }),
      }),
    }),
    getAnnotations: builder.query({
      query: params => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotations(params) }),
      }),
    }),
  }),
})

export default sparqlEndpoint

export const { useGetNotesOnFirstBeatQuery, useGetNoteInfoQuery, useGetAnnotationsQuery } = sparqlEndpoint
