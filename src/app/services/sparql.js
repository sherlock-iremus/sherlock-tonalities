import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getContributor } from '../../features/items/ContributorItem'
import { stringToColor } from '../../utils'
import { BASE_API_URL } from './sherlockApi'

export const sparqlEndpoint = createApi({
  reducerPath: 'sparqlApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://sherlock.freeboxos.fr:3030/iremus/sparql'
        : BASE_API_URL + 'sparql',
  }),
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
