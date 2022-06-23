import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const sherlockApi = createApi({
  reducerPath: 'sherlockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://data-iremus.huma-num.fr/sherlock/api/',
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
    postAnnotation: builder.mutation({
      query: body => ({
        url: 'e13',
        method: 'POST',
        body,
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

export const { usePostSelectionMutation, usePostAnnotationMutation, useGetUserIdQuery } = sherlockApi
