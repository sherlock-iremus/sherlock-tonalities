import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { stringToColor } from '../../utils'
import { BASE_API_URL, isInDevMode } from './sherlockApi'
import { getContributor } from 'sherlock-sparql-queries/src/queries/contributor'

export const sparqlEndpoint = createApi({
  reducerPath: 'sparqlApi',
  baseQuery: fetchBaseQuery({ baseUrl: isInDevMode ? 'http://localhost:3030/iremus' : BASE_API_URL + 'sparql' }),
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
  }),
})

export default sparqlEndpoint

export const { useGetContributorQuery } = sparqlEndpoint
