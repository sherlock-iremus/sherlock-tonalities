import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const sherlockApi = createApi({
  reducerPath: 'sherlockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://data-iremus.huma-num.fr/sherlock/api/',
  }),
  endpoints: builder => ({
    postSelection: builder.query({
      query: children => ({
        url: 'selection',
        method: 'POST',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJGw6lsaXggUG91bGxldC1QYWfDqHMiLCJuYmYiOjE2NTUxMjIwMDcsInJvbGVzIjpbXSwiaXNzIjoic2hlcmxvY2siLCJvcmNpZCI6IjAwMDAtMDAwMy0wNzQwLTc1MjciLCJleHAiOjE2NTUxMjU2MDcsImlhdCI6MTY1NTEyMjAwNywidXVpZCI6ImU0NzRjZDQzLTcwYzEtNGZhOC05MjNjLTRmZDJlNTYxNTgwNCJ9.q5tqN2wVcxswvZOaUtJh5tPFnRJO7qusk_8psCB4hyY`,
        },
        body: { children },
      }),
    }),
  }),
})

export default sherlockApi

export const { usePostSelectionQuery } = sherlockApi
