import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import { setIsUserConnected } from './globals'
import { DEV_ENV } from '../config/services'

export const BASE_API_URL = DEV_ENV ? 'http://localhost:5555/' : 'https://sherlock.freeboxos.fr/'

const SHERLOCK_API_ERROR = 'sherlockApi/'
const SHERLOCK_API_REFRESH_ENDPOIT = BASE_API_URL + 'sherlock/oauth/access_token'

export const service = createApi({
  reducerPath: 'service',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL + 'sherlock/api/', credentials: 'include' }),
  endpoints: builder => ({
    getUserId: builder.query({ query: () => ({}) }),
    postAnalyticalProject: builder.mutation({ query: body => ({ url: 'analytical-project', method: 'POST', body }) }),
    postAnnotation: builder.mutation({ query: body => ({ url: 'e13', method: 'POST', body }) }),
  }),
})

export const tokenExpirationHandler = api => next => async action => {
  if (isRejectedWithValue(action))
    if (action.type.startsWith(SHERLOCK_API_ERROR) && action.payload.status === 401) {
      const response = await fetch(SHERLOCK_API_REFRESH_ENDPOIT, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }).catch(response => response)
      if (response.status === 400) api.dispatch(setIsUserConnected(false))
      else api.dispatch(setIsUserConnected(true))
    }
  return next(action)
}

export default service

export const { useGetUserIdQuery, usePostAnalyticalProjectMutation, usePostAnnotationMutation } = service
