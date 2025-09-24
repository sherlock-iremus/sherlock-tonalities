import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getId } from '../utils'
//import { getContributor } from 'sherlock-sparql-queries/src/queries/contributor'
//import { getAnalyticalProject } from 'sherlock-sparql-queries/src/queries/analyticalProject'
import {
  exportProject,
  exportProjectToMeta,
  getAnalyticalProject,
  getAnnotations,
  getAssignments,
  getContributor,
  getFlatAnnotations,
  getIncomingAnnotation,
  getP140,
  getPersonalProjects,
  getProjects,
  getScoreUrl,
} from './queries'

const SPARQL_ENDPOINT = import.meta.env.DEV ? 'http://localhost:3030/iremus' : 'https://data-iremus.huma-num.fr/sparql'

export const sparql = createApi({
  reducerPath: 'sparql',
  baseQuery: fetchBaseQuery({ baseUrl: SPARQL_ENDPOINT }),
  endpoints: builder => ({
    getContributor: builder.query({
      query: contributorIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getContributor(contributorIri) }),
      }),
      transformResponse: ({
        results: {
          bindings: [{ contributor, color, emoji, orcid, name }],
        },
      }) => ({
        id: contributor?.value,
        color: '#' + color?.value,
        emoji: emoji?.value,
        orcid: orcid?.value,
        name: name?.value || 'Profile',
      }),
    }),
    getAnalyticalProject: builder.query({
      query: analyticalProjectIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnalyticalProject(analyticalProjectIri) }),
      }),
      transformResponse: ({
        results: {
          bindings: [binding],
        },
      }) => ({
        iri: binding.project.value,
        label: binding.content?.value || binding.label?.value || 'Untitled project',
        contributor: binding.contributor.value,
        isPublished:
          binding.privacyType?.value === 'http://data-iremus.huma-num.fr/id/54a5cf00-a46a-4435-b893-6eda0cdc5462',
        ...(binding.description && { description: binding.description.value }),
        ...(binding.color && { color: '#' + binding.color.value }),
      }),
    }),
    getP140: builder.query({
      query: e13 => ({
        method: 'POST',
        body: new URLSearchParams({ query: getP140(e13) }),
      }),
      transformResponse: response => response.results.bindings.map(binding => binding.p140.value),
    }),
    getIncomingAnnotation: builder.query({
      query: e13 => ({
        method: 'POST',
        body: new URLSearchParams({ query: getIncomingAnnotation(e13) }),
      }),
      transformResponse: response => ({
        incomingAnnotation: response.results.bindings[0]?.incoming?.value,
        incomingEntity: response.results.bindings[0]?.incomingEntity?.value,
      }),
    }),
    getAssignments: builder.query({
      query: entity => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAssignments(entity) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(binding => ({
          assignment: binding.assignment.value,
          author: binding.author.value,
          date: binding.date.value,
          ...((binding.type.value.includes('http://www.cidoc-crm.org/cidoc-crm/P106_is_composed_of') && {
            subentity: binding.p141.value,
            annotation: binding.annotation.value,
          }) ||
            (binding.p141.type === 'literal' ? { comment: binding.p141.value } : { concept: binding.p141.value })),
        })),
    }),
    getAnnotations: builder.query({
      query: projectIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotations(projectIri) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(({ annotation, entity, date, author, noteId, notes }) => ({
          annotation: annotation.value,
          entity: entity.value,
          date: date.value,
          author: author.value,
          noteId: getId(noteId.value),
          notes: Number(notes.value),
        })),
    }),
    getFlatAnnotations: builder.query({
      query: projectIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getFlatAnnotations(projectIri) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(({ entity, annotation, notes, concepts, date, author }) => ({
          entity: entity.value,
          annotation: annotation.value,
          notes: notes.value,
          concepts: concepts.value,
          date: date.value,
          author: author.value,
        })),
    }),
    exportProject: builder.query({
      query: params => ({
        url:
          '?' +
          new URLSearchParams({
            graph: 'http://data-iremus.huma-num.fr/graph/tonalities-contributions',
            query: exportProject(params),
          }),
        method: 'GET',
        responseHandler: response => response.text(),
      }),
    }),
    exportProjectToMeta: builder.query({
      query: projectIri => ({
        url:
          '?' +
          new URLSearchParams({
            graph: 'http://data-iremus.huma-num.fr/graph/tonalities-contributions',
            query: exportProjectToMeta(projectIri),
          }),
        method: 'GET',
        responseHandler: response => response.text(),
      }),
    }),
    getProjects: builder.query({
      query: params => ({
        method: 'POST',
        body: new URLSearchParams({ query: getProjects(params) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(e => ({
          iri: e.project.value,
          annotations: Number(e.annotations.value),
          contributor: e.contributor.value,
          label: e.label?.value || e.content?.value || 'Untitled project',
        })),
    }),
    getScoreUrl: builder.query({
      query: projectIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getScoreUrl(projectIri) }),
      }),
      transformResponse: response => response.results.bindings[0].url.value,
    }),
    getPersonalProjects: builder.query({
      query: userIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getPersonalProjects(userIri) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(e => ({
          iri: e.project.value,
          annotations: Number(e.annotations.value),
          label: e.label.value,
          scoreIri: e.scoreIri.value.split('#').shift(),
        })),
    }),
  }),
})

export default sparql

export const {
  useGetContributorQuery,
  useGetAnalyticalProjectQuery,
  useGetAnnotationsQuery,
  useGetP140Query,
  useGetAssignmentsQuery,
  useGetProjectsQuery,
  useGetPersonalProjectsQuery,
  useExportProjectQuery,
  useExportProjectToMetaQuery,
  useGetScoreUrlQuery,
  useGetIncomingAnnotationQuery,
  useGetFlatAnnotationsQuery,
} = sparql
