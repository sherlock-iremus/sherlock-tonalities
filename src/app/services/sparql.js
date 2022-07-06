import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  ANALYTICAL_ENTITY,
  NOTE,
  POSITIONNED_NOTE,
  SCORE,
  SELECTION,
  VERTICALITY,
} from '../../features/score/constants'
import { findKey, findType } from '../../features/score/utils'
import {
  getAnalyticalEntities,
  getAnnotation,
  getAnnotationInfo,
  getAnnotationSelection,
  getChildSelections,
  getEntityType,
  getIncommingAnnotations,
  getNoteInfo,
  getNoteSelections,
  getNotesOnFirstBeat,
  getNoteVerticality,
  getOutgoingAnnotations,
  getParentSelections,
  getPositionnedNoteInfo,
  getScoreSelections,
  getSelectionAnalyticalEntities,
  getSubAnnotations,
  getVerticalityCoordinates,
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
    getAnalyticalEntities: builder.query({
      query: entity => ({
        method: 'POST',
        body: new URLSearchParams({
          query:
            findType(entity) === SELECTION
              ? getSelectionAnalyticalEntities(entity.selectionIri)
              : getAnalyticalEntities(findKey(entity)),
        }),
      }),
      transformResponse: response =>
        response.results?.bindings?.map(e => ({
          analyticalEntityIri: e.entity?.value,
          propertyIri: e.predicat?.value,
          contributorIri: e.contributor?.value,
          analyticalProjetIri: e.project?.value,
          date: e.date?.value,
          assignments: e.assignments?.value,
        })),
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
          return null
        }),
    }),
    getParentSelections: builder.query({
      query: selectionIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getParentSelections(selectionIri) }),
      }),
      transformResponse: response => response.results?.bindings?.map(e => e.parent?.value),
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
        subject: element.subject,
        predicat: element.predicat?.value,
        object: element.object,
        date: element.date?.value,
        contributorIri: element.contributor?.value,
      }),
    }),
    getVerticalityCoordinates: builder.query({
      query: verticalityIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getVerticalityCoordinates(verticalityIri) }),
      }),
      transformResponse: ({
        results: {
          bindings: [
            {
              note: { value: noteIri },
            },
          ],
        },
      }) => noteIri,
    }),
    getPositionnedNoteInfo: builder.query({
      query: positionnedNoteIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getPositionnedNoteInfo(positionnedNoteIri) }),
      }),
      transformResponse: ({
        results: {
          bindings: [
            {
              attachedNote: { value: attachedNoteIri },
              clickedNote: { value: clickedNoteIri },
              verticality: { value: verticalityIri },
            },
          ],
        },
      }) => ({ attachedNoteIri, clickedNoteIri, verticalityIri }),
    }),
    getEntityType: builder.query({
      query: entityIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getEntityType(entityIri) }),
      }),
      transformResponse: ({
        results: {
          bindings: [
            {
              iri: { value: iri },
              type,
              label,
            },
          ],
        },
      }) => {
        if (type.value === NOTE) return { noteIri: iri }
        if (type.value === VERTICALITY) return { verticalityIri: iri }
        if (type.value === POSITIONNED_NOTE) return { positionnedNoteIri: iri }
        if (type.value === SELECTION) return { selectionIri: iri }
        if (type.value === ANALYTICAL_ENTITY) return { analyticalEntityIri: iri }
        if (type.value === SCORE) return { scoreIri: iri }
        if (label) return { classIri: iri, label: label.value }
        return null
      },
    }),
    getPredicatLabel: builder.query({
      query: entityIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getEntityType(entityIri) }),
      }),
      transformResponse: response => response.results.bindings[0].label.value,
    }),
  }),
})

export default sparqlEndpoint

export const {
  useGetNotesOnFirstBeatQuery,
  useGetNoteInfoQuery,
  useGetAnnotationInfoQuery,
  useGetSubAnnotationsQuery,
  useGetNoteSelectionsQuery,
  useGetScoreSelectionsQuery,
  useGetChildSelectionsQuery,
  useGetParentSelectionsQuery,
  useGetAnnotationSelectionQuery,
  useGetNoteVerticalityQuery,
  useGetVerticalityPositionnedNotesQuery,
  useGetIncomingAnnotationsQuery,
  useGetOutgoingAnnotationsQuery,
  useGetAnnotationQuery,
  useGetVerticalityCoordinatesQuery,
  useGetPositionnedNoteInfoQuery,
  useGetEntityTypeQuery,
  useGetPredicatLabelQuery,
  useGetAnalyticalEntitiesQuery,
} = sparqlEndpoint
