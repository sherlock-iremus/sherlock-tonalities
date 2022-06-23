import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  ANALYTICAL_ENTITY,
  NOTE,
  POSITIONNED_NOTE,
  SCORE,
  SELECTION,
  VERTICALITY,
} from '../../features/score/constants'
import {
  getAnnotation,
  getAnnotationInfo,
  getAnnotationSelection,
  getChildSelections,
  getConceptAnnotations,
  getIncommingAnnotations,
  getNoteAnnalyticalEntities,
  getNoteInfo,
  getNoteSelections,
  getNotesOnFirstBeat,
  getNoteVerticality,
  getOutgoingAnnotations,
  getParentSelections,
  getScoreAnnotations,
  getScoreSelections,
  getSelectionAnalyticalEntities,
  getSubAnnotations,
  getVerticalityPositionnedNotes,
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
        response.results?.bindings?.map(e => ({
          iri: e.selection?.value,
          entities: e.entities?.value,
          contributorIri: e.contributor?.value,
        })),
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
          if (e.type.value === ANALYTICAL_ENTITY) return { analyticalEntityIri: e.child.value }
          if (e.type.value === SCORE) return { scoreIri: e.child.value }
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
    getNoteVerticality: builder.query({
      query: noteIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getNoteVerticality(noteIri) }),
      }),
      transformResponse: response => response.results?.bindings[0]?.verticality?.value,
    }),
    getVerticalityPositionnedNotes: builder.query({
      query: verticalityIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getVerticalityPositionnedNotes(verticalityIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({
          positionnedNoteIri: e.positionned_note?.value,
          attachedNoteIri: e.note?.value,
        })),
    }),
    getSelectionAnalyticalEntities: builder.query({
      query: selectionIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getSelectionAnalyticalEntities(selectionIri) }),
      }),
      transformResponse: response => response.results?.bindings?.map(e => e.annotation?.value),
    }),
    getIncomingAnnotations: builder.query({
      query: entityIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getIncommingAnnotations(entityIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({
          annotationIri: e.annotation?.value,
          date: e.date?.value,
          contributorIri: e.contributor?.value,
          subject: e.subject?.value,
          predicat: e.predicat?.value,
        })),
    }),
    getOutgoingAnnotations: builder.query({
      query: entityIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getOutgoingAnnotations(entityIri) }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({
          annotationIri: e.annotation?.value,
          date: e.date?.value,
          contributorIri: e.contributor?.value,
          object: e.object?.value,
          predicat: e.predicat?.value,
        })),
    }),
    getAnnotation: builder.query({
      query: annotationIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotation(annotationIri) }),
      }),
      transformResponse: ({
        results: {
          bindings: [element],
        },
      }) => ({
        subject: element.subject?.value,
        predicat: element.predicat?.value,
        object: element.object?.type === 'litteral' ? element.object?.value : { conceptIri: element.object?.value },
        date: element.date?.value,
        contributorIri: element.contributor?.value,
      }),
    }),
  }),
})

export default sparqlEndpoint

export const {
  useGetNotesOnFirstBeatQuery,
  useGetNoteInfoQuery,
  useGetAnnotationInfoQuery,
  useGetSubAnnotationsQuery,
  useGetConceptAnnotationsQuery,
  useGetNoteSelectionsQuery,
  useGetScoreSelectionsQuery,
  useGetChildSelectionsQuery,
  useGetParentSelectionsQuery,
  useGetNoteAnnalyticalEntitiesQuery,
  useGetAnnotationSelectionQuery,
  useGetNoteVerticalityQuery,
  useGetVerticalityPositionnedNotesQuery,
  useGetSelectionAnalyticalEntitiesQuery,
  useGetIncomingAnnotationsQuery,
  useGetOutgoingAnnotationsQuery,
  useGetAnnotationQuery,
} = sparqlEndpoint
