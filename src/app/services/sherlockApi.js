import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const BASE_API_URL =
  process.env.NODE_ENV === 'development' ? 'https://sherlock.freeboxos.fr/' : 'https://data-iremus.huma-num.fr/'

export const isInDevMode = !!(process.env.NODE_ENV === 'development')

export const sherlockApi = createApi({
  reducerPath: 'sherlockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL + 'sherlock/api/',
    credentials: 'include',
  }),
  endpoints: builder => ({
    postSelection: builder.mutation({
      query: body => ({
        url: 'selection',
        method: 'POST',
        body,
      }),
    }),
    patchSelection: builder.mutation({
      query: ({ uuid, ...body }) => ({
        url: `selection/${uuid}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteSelection: builder.mutation({
      query: uuid => ({
        url: `selection/${uuid}`,
        method: 'DELETE',
      }),
    }),
    postAnnotation: builder.mutation({
      query: body => ({
        url: 'e13',
        method: 'POST',
        body,
      }),
    }),
    postAnalyticalEntity: builder.mutation({
      query: body => ({
        url: 'analytical-entity',
        method: 'POST',
        body,
      }),
    }),
    deleteAnalyticalEntity: builder.mutation({
      query: uuid => ({
        url: `analytical-entity/${uuid}`,
        method: 'DELETE',
      }),
    }),
    getUserId: builder.query({
      query: () => ({}),
    }),
  }),
})

export default sherlockApi

export const {
  usePostSelectionMutation,
  usePostAnnotationMutation,
  useGetUserIdQuery,
  usePatchSelectionMutation,
  useDeleteSelectionMutation,
  usePostAnalyticalEntityMutation,
  useDeleteAnalyticalEntityMutation,
} = sherlockApi
