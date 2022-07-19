import { AddComment, Close, Done, HistoryEdu } from '@mui/icons-material'
import {
  Alert,
  AppBar,
  CircularProgress,
  Drawer,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  SpeedDial,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { Item } from '../items/Item'
import options from '../../../app/services/p177_p141.json'
import { useDispatch, useSelector } from 'react-redux'
import { setAlert, setAnnotationEditor } from '../../../app/services/scoreSlice'
import { findKey } from '../utils'
import { useEffect, useState } from 'react'
import { usePostAnnotationMutation } from '../../../app/services/sherlockApi'
import { useGetOutgoingAnnotationsQuery } from '../../../app/services/sparql'
import { COLOR_SELECTED } from '../mei.css'
import { PropertyItem } from '../items/PropertyItem'

export const AnnotationEditor = () => {
  const dispatch = useDispatch()
  const [displayInfo, setDisplayInfo] = useState(true)
  const [selectedOption, setSelectedOption] = useState('')
  const {
    annotationEditor: { subject, predicat, object },
  } = useSelector(state => state.score)
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const { refetch } = useGetOutgoingAnnotationsQuery(findKey(subject), { skip: !subject })

  useEffect(() => !subject && setSelectedOption(''), [subject])

  const createAnnotation = async () => {
    if (!isLoading && (selectedOption || object)) {
      try {
        await postAnnotation({
          p140: findKey(subject),
          p177: predicat.iri,
          p141: findKey(object) || selectedOption,
          p141_type: options[predicat.iri].length ? 'uri' : object ? 'uri' : 'literal',
        }).unwrap()
        refetch()
        dispatch(setAnnotationEditor())
        dispatch(setAlert({ confirmation: 'Annotation was successfully created' }))
      } catch {
        dispatch(setAlert({ error: 'An error occured while creating the annotation' }))
      }
    }
  }

  return (
    <Drawer open={!!subject} anchor="right" variant="persistent" SlideProps={{ direction: 'up' }}>
      {subject && (
        <Box sx={{ width: 450 }}>
          <AppBar position="sticky" sx={{ bgcolor: COLOR_SELECTED }}>
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
              <Tabs
                value={0}
                textColor="inherit"
                centered
                sx={{ flexGrow: 1, '& .MuiTabs-indicator': { backgroundColor: COLOR_SELECTED } }}
              >
                <Tab label="New annotation" icon={<AddComment />} />
              </Tabs>
            </Toolbar>
          </AppBar>

          <ListSubheader>Target entity</ListSubheader>
          <Item key={findKey(subject)} {...subject} />

          <ListSubheader>Assigned property</ListSubheader>
          <PropertyItem propertyIri={predicat.iri} />

          <ListSubheader>Assigned value</ListSubheader>
          <Box sx={{ ml: 2, mr: 2 }}>
            {options[predicat.iri].length ? (
              <Select required value={selectedOption} onChange={event => setSelectedOption(event.target.value)}>
                {options[predicat.iri].map(option => (
                  <MenuItem key={option.iri} value={option.iri}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <>
                {displayInfo && (
                  <Alert severity="info" onClose={() => setDisplayInfo(false)} sx={{ mb: 2 }}>
                    Insert text justification or select entity from score or navigator
                  </Alert>
                )}
                {object ? (
                  <Item {...object} isEntity />
                ) : (
                  <TextField
                    value={selectedOption}
                    onChange={event => setSelectedOption(event.target.value)}
                    placeholder="Insert text justification"
                    rows={2}
                    multiline
                    fullWidth
                  />
                )}
              </>
            )}
          </Box>

          <Tooltip title="Validate">
            <SpeedDial
              onClick={createAnnotation}
              ariaLabel="validate"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                '& .MuiSpeedDial-fab': { backgroundColor: COLOR_SELECTED },
              }}
              icon={isLoading ? <CircularProgress /> : <Done />}
            />
          </Tooltip>
        </Box>
      )}
    </Drawer>
  )
}
