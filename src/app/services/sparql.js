import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  getAnnotationInfo,
  getConceptAnnotations,
  getNoteInfo,
  getNoteSelections,
  getNotesOnFirstBeat,
  getScoreAnnotations,
  getScoreSelections,
  getSubAnnotations,
} from './sparqlQueries'

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
      transformResponse: response => {
        const {
          results: {
            bindings: [
              {
                pname: { value: pname },
                oct: { value: oct },
                accid,
              },
            ],
          },
        } = response

        let alteration = ''
        if (accid) {
          switch (accid.value) {
            case 'f':
              alteration = '♭'
              break
            case 's':
              alteration = '#'
              break
            case 'n':
              alteration = '♮'
              break
          }
        }

        return pname.toUpperCase() + oct + alteration
      },
    }),
    getAnnotations: builder.query({
      query: scoreIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getScoreAnnotations(scoreIri) }),
      }),
    }),
    getAnnotationInfo: builder.query({
      query: annotationIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotationInfo(annotationIri) }),
      }),
      transformResponse: response => response.results?.bindings?.map(e => e.concept?.value)
    }),
    getSubAnnotations: builder.query({
      query: annotationIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getSubAnnotations(annotationIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({ entity: e.selection?.value, concept: e.type?.value })),
    }),
    getConceptAnnotations: builder.query({
      query: conceptIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getConceptAnnotations(conceptIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({ iri: e.entity?.value, label: e.programName?.value })),
    }),
    getNoteSelections: builder.query({
      query: noteIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getNoteSelections(noteIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({ iri: e.selection?.value, created: e.created?.value })),
    }),
    getScoreSelections: builder.query({
      query: scoreIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getScoreSelections(scoreIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({ iri: e.selection?.value, entities: e.entities?.value })),
    }),
  }),
})

export default sparqlEndpoint

export const {
  useGetNotesOnFirstBeatQuery,
  useGetNoteInfoQuery,
  useGetAnnotationsQuery,
  useGetAnnotationInfoQuery,
  useGetSubAnnotationsQuery,
  useGetConceptAnnotationsQuery,
  useGetNoteSelectionsQuery,
  useGetScoreSelectionsQuery
} = sparqlEndpoint
