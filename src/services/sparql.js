import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getPage, stringToColor } from '../utils'
//import { getContributor } from 'sherlock-sparql-queries/src/queries/contributor'
//import { getAnalyticalProject } from 'sherlock-sparql-queries/src/queries/analyticalProject'
import { DEV_ENV } from '../config/services'
import { getAnalyticalProject, getAnnotations, getAssignments, getContributor, getP140, getProjects } from './queries'

const SPARQL_ENDPOINT = DEV_ENV ? 'http://localhost:3030/iremus' : 'https://sherlock.freeboxos.fr/sparql'

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
          bindings: [{ contributor, program, color, emoji }],
        },
      }) =>
        program
          ? { color: stringToColor(contributor.value), emoji: '🖥' }
          : { color: '#' + color?.value, emoji: emoji?.value },
    }),
    getAnalyticalProject: builder.query({
      query: analyticalProjectIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnalyticalProject(analyticalProjectIri) }),
      }),
      transformResponse: ({
        results: {
          bindings: [{ label, contributor, draft }],
        },
      }) => ({ label: label.value, contributor: contributor.value, ...(draft && { isDraft: true }) }),
    }),
    getP140: builder.query({
      query: e13 => ({
        method: 'POST',
        body: new URLSearchParams({ query: getP140(e13) }),
      }),
      transformResponse: response => response.results.bindings.map(binding => binding.p140.value),
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
          ...((binding.type && { subentity: binding.p141.value, annotation: binding.annotation.value }) ||
            (binding.p141.type === 'literal' ? { comment: binding.p141.value } : { concept: binding.p141.value })),
        })),
    }),
    getAnnotations: builder.query({
      query: ({ scoreIri, projectIri }) => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotations(scoreIri, projectIri) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(({ annotation, entity, date, author, page }) => ({
          annotation: annotation.value,
          entity: entity.value,
          date: date.value,
          author: author.value,
          page: getPage(page.value),
        })),
    }),
    exportProject: builder.query({
      query: () => ({
        url:
          '?' +
          new URLSearchParams({
            graph: 'http://data-iremus.huma-num.fr/graph/sherlock',
          }),
        method: 'GET',
        headers: { 'Content-Type': 'text/turtle' },
        responseHandler: response => response.text(),
      }),
    }),
    getProjects: builder.query({
      query: scoreIri => ({
        method: 'POST',
        body: new URLSearchParams({ query: getProjects(scoreIri) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(e => ({
          iri: e.project.value,
          annotations: Number(e.annotations.value),
          label: e.label.value,
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
  useExportProjectQuery,
} = sparql
