import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const isInDevMode = !(process.env.NODE_ENV !== 'development')

export const BASE_API_URL = isInDevMode ? 'http://localhost:5555/' : 'https://sherlock.freeboxos.fr/'

export const sherlockApi = createApi({
  reducerPath: 'sherlockApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL + 'sherlock/api/', credentials: 'include' }),
  endpoints: builder => ({
    getUserId: builder.query({ query: () => ({}) }),
    postAnalyticalProject: builder.mutation({ query: body => ({ url: 'analytical-project', method: 'POST', body }) }),
  }),
})

export default sherlockApi

export const { useGetUserIdQuery, usePostAnalyticalProjectMutation } = sherlockApi
