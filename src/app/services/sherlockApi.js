import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const sherlockApi = createApi({
  reducerPath: 'sherlockApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.34:5555/sherlock/api/' }),
  endpoints: builder => ({
    getToken: builder.query({
      query: () => ({
        url: 'login',
        method: 'POST',
        body: new URLSearchParams({ username: 'sherlock', password: 'kcolrehs' }),
      }),
      transformResponse: response => response.access_token
    }),
  }),
})

export default sherlockApi

export const { useGetTokenQuery } = sherlockApi
