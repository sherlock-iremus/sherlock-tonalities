import { Alert, Snackbar } from '@mui/material'

export const AlertMessage = ({ confirmationMessage, errorMessage }) =>
  (confirmationMessage || errorMessage) && (
    <Snackbar
      open={!!(confirmationMessage || errorMessage)}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={(confirmationMessage && 'success') || (errorMessage && 'error')}>
        {confirmationMessage || errorMessage}
      </Alert>
    </Snackbar>
  )
