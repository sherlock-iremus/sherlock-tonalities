import { AudioFile, KeyboardReturn } from '@mui/icons-material'
import {
  Alert,
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogTitle,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Tooltip,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostAnalyticalProjectMutation } from '../services/service'
import { Input } from '../components/Input'
import { getUuid } from '../utils'

export const NewProject = ({ isOpen, onClose, score }) => {
  const navigate = useNavigate()
  const [label, setLabel] = useState('')
  const [error, setError] = useState(null)
  const [url, setUrl] = useState('')
  const [postAnalyticalProject, { isLoading }] = usePostAnalyticalProjectMutation()

  const canCreateProject = label.length && url && !isLoading

  useEffect(() => {
    if (score) setUrl(score.meiUrl)
  }, [score])

  const createAnalyticalProject = async () => {
    if (canCreateProject)
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Invalid URL')
        const file = await response.text()
        if (!file) throw new Error('No file found at the provided URL')
        const data = window.tk.loadData(file)
        if (!data) throw new Error('Enable to render the provided file')
        const request = await postAnalyticalProject({ label }).unwrap()
        const project = request.find(e => e['@type'].includes('http://www.cidoc-crm.org/cidoc-crm/E7_Activity'))
        const projectId = getUuid(project['@id'])
        navigate(`/project/${projectId}`, { state: { url } })
      } catch (error) {
        setError(error)
      }
  }
  return (
    <Dialog open={isOpen} {...{ onClose }} sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <DialogTitle>New analytical project</DialogTitle>
      <Input
        value={label}
        onChange={event => setLabel(capitalize(event.target.value))}
        autoFocus
        placeholder="Project name"
        fullWidth
        onKeyDown={e => e.key === 'Enter' && createAnalyticalProject()}
      />
      {score ? (
        <Stack p={1}>
          <ListItemButton selected disableRipple dense sx={{ borderRadius: 4 }}>
            <ListItemIcon>
              <AudioFile />
            </ListItemIcon>
            <ListItemText primary={score?.scoreTitle} secondary="Tonalities corpus" />
          </ListItemButton>
        </Stack>
      ) : (
        <Input
          value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder="Score URL"
          fullWidth
          onKeyDown={e => e.key === 'Enter' && createAnalyticalProject()}
        />
      )}
      <DialogActions>
        <Tooltip title={<KeyboardReturn sx={{ width: 16, height: 16 }} />}>
          <span>
            <Button disabled={!canCreateProject} onClick={createAnalyticalProject}>
              Create project
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setError(null)}
      >
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ borderRadius: 3, boxShadow: 1, bgcolor: 'secondary.light' }}
        >
          Invalid MEI file, please provide a valid URL : {error?.toString()}
        </Alert>
      </Snackbar>
    </Dialog>
  )
}
