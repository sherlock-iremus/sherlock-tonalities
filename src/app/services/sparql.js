import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ANNALYTICAL_ENTITY, NOTE, POSITIONNED_NOTE, SELECTION, VERTICALITY } from '../../features/meiviewer/constants'
import {
  getAnnotationInfo,
  getAnnotationSelection,
  getChildSelections,
  getConceptAnnotations,
  getNoteAnnalyticalEntities,
  getNoteInfo,
  getNoteSelections,
  getNotesOnFirstBeat,
  getParentSelections,
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
      transformResponse: response => response.results?.bindings?.map(e => e.concept?.value),
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
        response.results?.bindings?.map(e => ({ iri: e.selection?.value, entities: e.entities?.value })),
    }),
    getScoreSelections: builder.query({
      query: scoreIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getScoreSelections(scoreIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({ iri: e.selection?.value, entities: e.entities?.value })),
    }),
    getChildSelections: builder.query({
      query: selectionIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getChildSelections(selectionIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => {
          if (e.type.value === NOTE) return { noteIri: e.child.value }
          if (e.type.value === VERTICALITY) return { verticalityIri: e.child.value }
          if (e.type.value === POSITIONNED_NOTE) return { positionnedNoteIri: e.child.value }
          if (e.type.value === SELECTION) return { selectionIri: e.child.value }
          if (e.type.value === ANNALYTICAL_ENTITY) return { annalyticalEntityIri: e.child.value }
        }),
    }),
    getParentSelections: builder.query({
      query: selectionIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getParentSelections(selectionIri) }),
      }),
      transformResponse: response => response.results?.bindings?.map(e => e.parent?.value),
    }),
    getNoteAnnalyticalEntities: builder.query({
      query: noteIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getNoteAnnalyticalEntities(noteIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({ iri: e.annotation?.value, concept: e.concept?.value })),
    }),
    getAnnotationSelection: builder.query({
      query: annotationIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotationSelection(annotationIri) }),
      }),
      transformResponse: response => response.results?.bindings[0]?.selection?.value,
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
  useGetScoreSelectionsQuery,
  useGetChildSelectionsQuery,
  useGetParentSelectionsQuery,
  useGetNoteAnnalyticalEntitiesQuery,
  useGetAnnotationSelectionQuery,
} = sparqlEndpoint
