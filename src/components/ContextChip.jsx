import { Chip, Stack } from '@mui/material'

export const ContextChip = ({ primary, secondary }) => (
  <Stack>
    <Chip
      label={secondary}
      color="primary"
      variant="outlined"
      size="small"
      sx={{ position: 'absolute', '& .MuiChip-label': { fontSize: 9 }, cursor: 'pointer' }}
    />
    <Chip label={primary} color="primary" sx={{ marginTop: 2, cursor: 'pointer' }} />
  </Stack>
)
