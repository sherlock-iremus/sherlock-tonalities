import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = 'https://gitlab.huma-num.fr/api/v4/projects/3940/jobs/artifacts/main/raw/public/models.json?job=models'

export const models = createApi({
  reducerPath: 'models',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: builder => ({
    getModels: builder.query({ query: () => ({}) }),
  }),
})

export default models

export const { useGetModelsQuery } = models
