import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const sparqlEndpoint = createApi({
  reducerPath: 'sparqlApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://data-iremus.huma-num.fr/sparql' }),
  endpoints: builder => ({}),
})

export default sparqlEndpoint

export const {} = sparqlEndpoint
