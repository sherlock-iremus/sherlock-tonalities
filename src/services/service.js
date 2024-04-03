import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import { setIsUserConnected } from './globals'

export const BASE_API_URL = import.meta.env.DEV ? 'http://localhost:5555/' : 'https://data-iremus.huma-num.fr/'

const SHERLOCK_API_ERROR = 'service/executeQuery/rejected'
const SHERLOCK_API_REFRESH_ENDPOIT = BASE_API_URL + 'sherlock/oauth/access_token'

export const service = createApi({
  reducerPath: 'service',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL + 'sherlock/', credentials: 'include' }),
  endpoints: builder => ({
    getUserId: builder.query({ query: () => ({ url: 'api/' }) }),
    logOut: builder.mutation({ query: () => ({ url: 'logout/', method: 'POST' }) }),
    putUser: builder.mutation({ query: body => ({ url: 'api/user/config', method: 'PUT', body }) }),
    postAnalyticalProject: builder.mutation({
      query: body => ({ url: 'api/analytical-project', method: 'POST', body }),
    }),
    deleteAnalyticalProject: builder.mutation({
      query: uuid => ({ url: `api/analytical-project/${uuid}`, method: 'DELETE' }),
    }),
    postAnnotation: builder.mutation({ query: body => ({ url: 'api/e13', method: 'POST', body }) }),
    deleteAnnotation: builder.mutation({ query: iri => ({ url: `api/e13/${iri}`, method: 'DELETE' }) }),
  }),
})

export const tokenExpirationHandler = api => next => async action => {
  if (isRejectedWithValue(action))
    if (action.type.startsWith(SHERLOCK_API_ERROR) && action.payload.status === 401) {
      const response = await fetch(SHERLOCK_API_REFRESH_ENDPOIT + '?grant_type=refresh_token', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', grant_type: 'refresh_token' },
      }).catch(response => response)
      if (response.status === 400) api.dispatch(setIsUserConnected(false))
      else api.dispatch(setIsUserConnected(true))
    }
  return next(action)
}

export default service

export const {
  useGetUserIdQuery,
  useLogOutMutation,
  usePostAnalyticalProjectMutation,
  usePostAnnotationMutation,
  useDeleteAnnotationMutation,
  usePutUserMutation,
  useDeleteAnalyticalProjectMutation,
} = service
