import { Alert, Snackbar } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setAlert } from '../../../app/services/scoreSlice'

export const AlertMessage = ({ confirmation, error }) => {
  const dispatch = useDispatch()
  return (
    (confirmation || error) && (
      <Snackbar
        open={!!(confirmation || error)}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => dispatch(setAlert())}
      >
        <Alert severity={(confirmation && 'success') || (error && 'error')}>{confirmation || error}</Alert>
      </Snackbar>
    )
  )
}
