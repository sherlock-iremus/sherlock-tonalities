import { Alert, Snackbar, Stack } from '@mui/material'
import { KeyboardCommandKey, KeyboardControlKey, KeyboardOptionKey } from '@mui/icons-material'
import { useDailyRender } from '../../hooks/useDailyRender'

export const Tutorial = () => {
  const { shouldRender, onClose } = useDailyRender('tutorialRender')
  console.log(shouldRender)
  return shouldRender ? (
    <Snackbar open={shouldRender} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={onClose}>
      <Alert severity="info" onClose={onClose} sx={{ borderRadius: 3, boxShadow: 1, bgcolor: 'secondary.light' }}>
        <Stack direction="row" alignItems="center">
          Hold <KeyboardOptionKey fontSize="36px" sx={{ px: 0.5 }} /> to select a verticality, hold
          <KeyboardControlKey fontSize="36px" sx={{ px: 0.5 }} /> to select a range,
          <KeyboardCommandKey fontSize="36px" sx={{ pl: 0.5 }} /> +A to select all notes
        </Stack>
      </Alert>
    </Snackbar>
  ) : null
}
