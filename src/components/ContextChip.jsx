import { Chip, Stack } from '@mui/material'
import { useState } from 'react'

export const ContextChip = ({ primary, secondary, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Stack onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Chip
        label={secondary}
        color="primary"
        variant="outlined"
        size="small"
        sx={{ position: 'absolute', '& .MuiChip-label': { fontSize: 9 }, cursor: 'pointer', right: 10 }}
      />
      <Chip label={primary} color="primary" sx={{ marginTop: 2, cursor: 'pointer' }} {...(isHovered && { onDelete })} />
    </Stack>
  )
}
