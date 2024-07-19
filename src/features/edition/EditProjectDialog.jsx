import { Button, Dialog, DialogContent, DialogContentText, Radio, Stack, Tooltip, Typography } from '@mui/material'
import { usePatchProjectMutation } from '../../services/service'
import { colors, getUuid } from '../../utils'
import { useEffect, useState } from 'react'
import { Input } from '../../components/Input'
import { Switch } from '../../components/Switch'

export const EditProjectDialog = ({ project, isEditing, setIsEditing, refetch }) => {
  const [patchProject, { isLoading }] = usePatchProjectMutation()

  const [label, setLabel] = useState(project.label || '')
  const [description, setDescription] = useState(project.description || '')
  const [color, setColor] = useState(project.color || '#000000')
  const [isPublished, setIsPublished] = useState(project.isPublished || false)

  const updateProject = async () => {
    if (!isLoading)
      try {
        const privacyTypeUuid = isPublished
          ? '54a5cf00-a46a-4435-b893-6eda0cdc5462'
          : 'cabe46bf-23d4-4392-aa20-b3eb21ad7dfd'
        const iri = getUuid(project.iri)
        const body = {
          label,
          description,
          color: color.slice(1),
          privacyTypeUuid,
          contribution_graph: 'tonalities-contributions',
        }
        await patchProject({ iri, body })
        refetch()
      } catch (error) {
        console.error(error)
      }
  }

  return (
    <Dialog open={isEditing} onClose={() => setIsEditing(false)} sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <DialogContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Edit project</Typography>
          <Tooltip title={isPublished ? 'Published' : 'Not published'}>
            <Switch disabled={isLoading} checked={isPublished} onChange={() => setIsPublished(!isPublished)} />
          </Tooltip>
        </Stack>
        <DialogContentText>Name</DialogContentText>
        <Input value={label} onChange={event => setLabel(event.target.value)} placeholder="Label" fullWidth />
        <DialogContentText>Description</DialogContentText>
        <Input
          value={description}
          onChange={event => setDescription(event.target.value)}
          placeholder="Description"
          multiline
          fullWidth
        />
        <DialogContentText>Color</DialogContentText>
        <Stack flex={1} direction="row">
          {colors.map((c, index) => (
            <Radio
              key={index}
              checked={color === c[500]}
              onChange={() => setColor(c[500])}
              value={c[500]}
              sx={{
                color: c[500],
                '&.Mui-checked': {
                  color: c[500],
                },
              }}
            />
          ))}
        </Stack>
        <Stack pt={2}>
          <Button onClick={updateProject} disabled={isLoading}>
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
