import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import env from '../../env.json'

const headers = process.env.NODE_ENV === 'development' ? { Authorization: `Bearer ${env.token}` } : null

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
        headers,
        body,
      }),
    }),
    postAnnotation: builder.mutation({
      query: body => ({
        url: 'e13',
        method: 'POST',
        headers,
        body,
      }),
    }),
  }),
})

export default sherlockApi

export const { usePostSelectionMutation, usePostAnnotationMutation } = sherlockApi
