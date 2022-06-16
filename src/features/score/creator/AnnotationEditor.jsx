import { AddComment, Close, Done } from '@mui/icons-material'
import {
  Alert,
  AppBar,
  CircularProgress,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  SpeedDial,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { Box } from '@mui/system'
import { Item } from '../items/Item'
import options from '../../../app/services/p177_p141.json'
import { useDispatch, useSelector } from 'react-redux'
import { setAnnotationEditor } from '../../slice/scoreSlice'
import { findKey } from '../utils'
import { useState } from 'react'
import { usePostAnnotationMutation } from '../../../app/services/sherlockApi'
import { useGetOutgoingAnnotationsQuery } from '../../../app/services/sparql'

export const AnnotationEditor = ({ subject, predicat }) => {
  const dispatch = useDispatch()
  const [selectedOption, setSelectedOption] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const { baseUrl } = useSelector(state => state.score)
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const { refetch } = useGetOutgoingAnnotationsQuery(findKey(subject), { skip: !subject })

  const createAnnotation = async () => {
    if (selectedOption && !isLoading) {
      try {
        await postAnnotation({
          p140: findKey(subject),
          p177: predicat.iri,
          p141: selectedOption,
          p141_type: 'uri',
        }).unwrap()
        setConfirmationMessage('Annotation was successfully created')
        refetch()
        dispatch(setAnnotationEditor())
      } catch (error) {
        setErrorMessage(`An error occured while creating the annotation, ${error}`)
      }
    }
  }

  return (
    <Drawer open={!!subject} anchor="right" variant="persistent" SlideProps={{ direction: 'up' }}>
      {subject && (
        <Box sx={{ width: 400 }}>
          <AppBar position="sticky" sx={{ bgcolor: grey[500] }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Annotation editor
              </Typography>
              <Tooltip title="Close">
                <IconButton edge="end" color="inherit" onClick={() => dispatch(setAnnotationEditor())}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Toolbar>
            <Toolbar>
              <Tabs value={0} textColor="inherit" indicatorColor="inherit" centered sx={{ flexGrow: 1 }}>
                <Tab label={predicat.label || predicat.iri.slice(baseUrl.length)} icon={<AddComment />} />
              </Tabs>
            </Toolbar>
          </AppBar>
          <Item
            key={findKey(subject)}
            {...subject}
            {...{ baseUrl }}
            secondaryAction={
              <Select required value={selectedOption} onChange={event => setSelectedOption(event.target.value)}>
                {options[predicat.iri].map(option => (
                  <MenuItem key={option.iri} value={option.iri}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            }
          />

          <Tooltip title="Validate">
            <SpeedDial
              onClick={createAnnotation}
              ariaLabel="validate"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                '& .MuiSpeedDial-fab': { backgroundColor: grey[500] },
              }}
              icon={isLoading ? <CircularProgress /> : <Done />}
            />
          </Tooltip>

          <Snackbar
            open={!!confirmationMessage}
            autoHideDuration={6000}
            onClose={() => setConfirmationMessage('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert severity="success">{confirmationMessage}</Alert>
          </Snackbar>

          <Snackbar
            open={!!errorMessage}
            autoHideDuration={6000}
            onClose={() => setErrorMessage('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert severity="warning">{errorMessage}</Alert>
          </Snackbar>
        </Box>
      )}
    </Drawer>
  )
}
