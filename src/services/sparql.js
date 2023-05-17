import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getPage, stringToColor } from '../utils'
import { getContributor } from 'sherlock-sparql-queries/src/queries/contributor'
import { getAnalyticalProject } from 'sherlock-sparql-queries/src/queries/analyticalProject'
import { DEV_ENV } from '../config/services'
import { getAnnotations, getP140 } from './queries'

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
    getAnnotations: builder.query({
      query: ({ scoreIri, projectIri }) => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotations(scoreIri, projectIri) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(({ concept, date, entity, e13, page }) => ({
          concept: concept.value,
          date: date.value,
          entity: entity.value,
          e13: e13.value,
          page: getPage(page.value),
        })),
    }),
  }),
})

export default sparql

export const { useGetContributorQuery, useGetAnalyticalProjectQuery, useGetAnnotationsQuery, useGetP140Query } = sparql
