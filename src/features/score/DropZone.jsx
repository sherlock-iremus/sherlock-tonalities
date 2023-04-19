import { useDroppable } from '@dnd-kit/core'
import { Stack, Typography } from '@mui/material'

export const DropZone = () => {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable' })

  return (
    <Stack ref={setNodeRef} paddingY={4} flex={1} justifyContent="center" bgcolor={isOver ? 'green' : undefined}>
      <Typography textAlign="center" color="text.secondary" fontSize={12} padding={2}>
        Drag and drop concepts from the left panel to assign them to the selected notes
        {isOver && 'OUIIIIIIIII'}
      </Typography>
    </Stack>
  )
}
