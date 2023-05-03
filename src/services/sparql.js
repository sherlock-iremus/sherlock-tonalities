import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getPage, stringToColor } from '../utils'
import { getContributor } from 'sherlock-sparql-queries/src/queries/contributor'
import { getAnalyticalProject } from 'sherlock-sparql-queries/src/queries/analyticalProject'
import { getAnnotations } from 'sherlock-sparql-queries/src/queries/annotations'

import { DEV_ENV, NGROK_3030 } from '../config/services'

const SPARQL_ENDPOINT = DEV_ENV ? 'http://localhost:3030/' : NGROK_3030

export const sparql = createApi({
  reducerPath: 'sparql',
  baseQuery: fetchBaseQuery({ baseUrl: SPARQL_ENDPOINT + 'iremus' }),
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
    getAnnotations: builder.query({
      query: ({ scoreIri, projectIri }) => ({
        method: 'POST',
        body: new URLSearchParams({ query: getAnnotations(scoreIri, projectIri) }),
      }),
      transformResponse: response =>
        response.results.bindings.map(({ concept, date, entity, notes, page }) => ({
          concept: concept.value,
          date: date.value,
          entity: entity.value,
          notes: notes.value,
          page: getPage(page.value),
        })),
    }),
  }),
})

export default sparql

export const { useGetContributorQuery, useGetAnalyticalProjectQuery, useGetAnnotationsQuery } = sparql
