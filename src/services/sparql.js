import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { stringToColor } from '../utils'
import { getContributor } from 'sherlock-sparql-queries/src/queries/contributor'
import { getAnalyticalProject } from 'sherlock-sparql-queries/src/queries/analyticalProject'
import { BASE_API_URL, DEV_ENV } from './service'

export const sparql = createApi({
  reducerPath: 'sparql',
  baseQuery: fetchBaseQuery({ baseUrl: DEV_ENV ? 'http://localhost:3030/iremus' : BASE_API_URL + 'sparql' }),
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
  }),
})

export default sparql

export const { useGetContributorQuery, useGetAnalyticalProjectQuery } = sparql