import { isRejectedWithValue } from '@reduxjs/toolkit'
import { setIsUserConnected } from './scoreSlice'

const SHERLOCK_API_ERROR = 'sherlockApi/'
const SHERLOCK_API_REFRESH_ENDPOIT = 'https://data-iremus.huma-num.fr/sherlock/oauth/access_token'

export const tokenExpirationHandler = api => next => async action => {
  if (isRejectedWithValue(action)) {
    if (action.type.startsWith(SHERLOCK_API_ERROR) && action.payload.status === 401) {
      const response = await fetch(SHERLOCK_API_REFRESH_ENDPOIT, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }).catch(response => response)
      if (response.status === 400) api.dispatch(setIsUserConnected(false))
      else api.dispatch(setIsUserConnected(true))
    }
  }
  return next(action)
}
