import { CircularProgress, Stack } from '@mui/material'

export const Loader = ({ isLoading = true }) =>
  !isLoading ? null : (
    <Stack flex={1} justifyContent="center" alignItems="center" borderRadius={3} bgcolor="white" boxShadow={1}>
      <CircularProgress />
    </Stack>
  )
