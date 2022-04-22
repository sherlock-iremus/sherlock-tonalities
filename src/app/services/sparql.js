import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAnnotationInfo, getAnnotations, getNoteInfo, getNotesOnFirstBeat, getSubAnnotations } from './sparqlQueries'

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
      query: scoreIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotations(scoreIri) }),
      }),
    }),
    getAnnotationInfo: builder.query({
      query: annotationIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotationInfo(annotationIri) }),
      }),
    }),
    getSubAnnotations: builder.query({
      query: annotationIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getSubAnnotations(annotationIri) }),
      }),
    }),
  }),
})

export default sparqlEndpoint

export const { useGetNotesOnFirstBeatQuery, useGetNoteInfoQuery, useGetAnnotationsQuery, useGetAnnotationInfoQuery, useGetSubAnnotationsQuery } = sparqlEndpoint
