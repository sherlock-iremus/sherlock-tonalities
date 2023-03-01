import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const sherlockApi = createApi({
  reducerPath: 'sherlockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: !process.env.NODE_ENV
      ? 'http://sherlock.freeboxos.fr/sherlock/api/'
      : 'https://data-iremus.huma-num.fr/sherlock/api/',
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
      query: () => ({
        responseHandler: response => response.text(),
      }),
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
