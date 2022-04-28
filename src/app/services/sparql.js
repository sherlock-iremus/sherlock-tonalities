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

export const {
  useGetNotesOnFirstBeatQuery,
  useGetNoteInfoQuery,
  useGetAnnotationsQuery,
  useGetAnnotationInfoQuery,
  useGetSubAnnotationsQuery,
} = sparqlEndpoint
