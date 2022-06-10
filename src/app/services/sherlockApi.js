import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const sherlockApi = createApi({
  reducerPath: 'sherlockApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://data-iremus.huma-num.fr/sherlock/api/', credentials: 'include' }),
  endpoints: builder => ({
    postSelection: builder.query({
      query: () => ({
        url: 'selection',
        method: 'POST',
        body: new URLSearchParams({ children: [] }),
      }),
      transformResponse: response => console.log(response),
    }),
  }),
})

export default sherlockApi

export const { usePostSelectionQuery } = sherlockApi
