import { Backdrop, CircularProgress } from '@mui/material'

export const Loader = ({ isLoading = true }) => (
  <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={isLoading}>
    <CircularProgress color="inherit" />
  </Backdrop>
)
