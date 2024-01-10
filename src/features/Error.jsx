import { Alert, Dialog, Stack } from '@mui/material'

export const Error = () => (
  <Stack height="100vh" justifyContent="center">
    <Dialog open>
      <Alert severity="error">An error occured</Alert>
    </Dialog>
  </Stack>
)
